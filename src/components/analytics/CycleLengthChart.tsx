"use client";

import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

interface VersionStat {
  platform: string;
  platformColor: string;
  version: string;
  cycleDays: number | null;
  publicReleaseDate?: string;
}

interface CycleLengthChartProps {
  versions: VersionStat[];
}

const MARGIN = { top: 28, right: 24, bottom: 82, left: 48 };
const CHART_HEIGHT = 340;

export function CycleLengthChart({ versions }: CycleLengthChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartVersions = useMemo(
    () =>
      versions
        .filter(
          (version) =>
            version.cycleDays !== null && version.version.endsWith(".0"),
        )
        .sort((left, right) =>
          (left.publicReleaseDate || left.version).localeCompare(
            right.publicReleaseDate || right.version,
            undefined,
            { numeric: true },
          ),
        )
        .slice(-30),
    [versions],
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    const container = containerRef.current;

    if (!svgElement || !container || chartVersions.length === 0) {
      return;
    }

    function renderChart() {
      const width = Math.max(container!.clientWidth, 560);
      const svg = d3
        .select(svgElement)
        .attr("viewBox", `0 0 ${width} ${CHART_HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      svg.selectAll("*").remove();
      svg
        .append("title")
        .attr("id", "cycle-chart-title")
        .text("Beta cycle duration by major version");
      svg
        .append("desc")
        .attr("id", "cycle-chart-description")
        .text(
          "Bars compare the number of days from first beta to public release. A dashed line marks the average of the displayed cycles.",
        );

      const labels = chartVersions.map(
        (version) => `${version.platform} ${version.version}`,
      );
      const x = d3
        .scaleBand()
        .domain(labels)
        .range([MARGIN.left, width - MARGIN.right])
        .padding(0.24);
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(chartVersions, (version) => version.cycleDays!) || 120,
        ])
        .nice()
        .range([CHART_HEIGHT - MARGIN.bottom, MARGIN.top]);

      svg
        .append("g")
        .attr("transform", `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr("color", "var(--border-hover)")
        .selectAll("text")
        .attr("fill", "var(--text-secondary)")
        .attr("transform", "rotate(-48)")
        .attr("text-anchor", "end")
        .attr("font-family", "var(--font-mono)")
        .attr("font-size", "9px");

      const yAxis = svg
        .append("g")
        .attr("transform", `translate(${MARGIN.left},0)`)
        .call(d3.axisLeft(y).ticks(5).tickSize(-(width - MARGIN.left - MARGIN.right)));

      yAxis.attr("color", "var(--border)");
      yAxis.select(".domain").remove();
      yAxis
        .selectAll("text")
        .attr("fill", "var(--text-tertiary)")
        .attr("font-family", "var(--font-mono)")
        .attr("font-size", "9px");
      yAxis.selectAll(".tick line").attr("stroke-opacity", 0.55);

      svg
        .selectAll(".cycle-bar")
        .data(chartVersions)
        .join("rect")
        .attr("class", "cycle-bar")
        .attr("x", (version) =>
          x(`${version.platform} ${version.version}`)!,
        )
        .attr("y", (version) => y(version.cycleDays!))
        .attr("width", x.bandwidth())
        .attr("height", (version) => y(0) - y(version.cycleDays!))
        .attr("fill", (version) => version.platformColor)
        .attr("opacity", 0.76)
        .attr("rx", 0);

      const average =
        chartVersions.reduce(
          (sum, version) => sum + version.cycleDays!,
          0,
        ) / chartVersions.length;

      svg
        .append("line")
        .attr("x1", MARGIN.left)
        .attr("x2", width - MARGIN.right)
        .attr("y1", y(average))
        .attr("y2", y(average))
        .attr("stroke", "var(--milestone-rc)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "5,5");

      svg
        .append("text")
        .attr("x", width - MARGIN.right)
        .attr("y", y(average) - 8)
        .attr("text-anchor", "end")
        .attr("fill", "var(--milestone-rc)")
        .attr("font-family", "var(--font-mono)")
        .attr("font-size", "9px")
        .text(`AVERAGE ${Math.round(average)} DAYS`);
    }

    renderChart();
    const resizeObserver = new ResizeObserver(renderChart);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [chartVersions]);

  if (chartVersions.length === 0) {
    return (
      <div className="surface p-6 text-sm text-[var(--text-secondary)]">
        No completed major-version cycles are available in this view.
      </div>
    );
  }

  const average = Math.round(
    chartVersions.reduce(
      (sum, version) => sum + version.cycleDays!,
      0,
    ) / chartVersions.length,
  );
  const mobileVersions = chartVersions.slice(-12).reverse();
  const mobileMaximum = Math.max(
    ...mobileVersions.map((version) => version.cycleDays!),
    1,
  );
  const mobileAverage = Math.round(
    mobileVersions.reduce(
      (sum, version) => sum + version.cycleDays!,
      0,
    ) / mobileVersions.length,
  );

  return (
    <div>
      <div className="mobile-cycle-chart">
        <ol
          className="mobile-cycle-chart__list"
          aria-label="Recent beta cycle durations"
        >
          {mobileVersions.map((version) => {
            const label = `${version.platform} ${version.version}`;
            const width = Math.max(
              4,
              (version.cycleDays! / mobileMaximum) * 100,
            );

            return (
              <li
                key={`${version.platform}-${version.version}`}
                className="mobile-cycle-chart__row"
              >
                <span className="mobile-cycle-chart__label">{label}</span>
                <strong className="mobile-cycle-chart__value font-mono">
                  {version.cycleDays}d
                </strong>
                <span
                  className="mobile-cycle-chart__track"
                  aria-hidden="true"
                >
                  <i
                    style={{
                      background: version.platformColor,
                      width: `${width}%`,
                    }}
                  />
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mobile-cycle-chart__summary">
          {mobileVersions.length} most recent completed major-version cycles;
          average: <strong>{mobileAverage} days</strong>.
        </p>
      </div>

      <div className="desktop-cycle-chart">
        <div
          ref={containerRef}
          className="surface horizontal-scroll horizontal-scroll--medium overflow-x-auto p-4"
          role="region"
          aria-label="Scrollable beta cycle duration chart"
          tabIndex={0}
        >
          <svg
            ref={svgRef}
            className="block h-auto min-w-[35rem] w-full"
            role="img"
            aria-labelledby="cycle-chart-title cycle-chart-description"
          />
          <p className="mt-2 text-center text-xs text-[var(--text-tertiary)]">
            {chartVersions.length} completed major-version cycles shown;
            displayed average: {average} days.
          </p>
        </div>
        <p className="horizontal-scroll__hint horizontal-scroll__hint--medium">
          <span aria-hidden="true">↔</span>
          Scroll horizontally to explore the full duration series.
        </p>
      </div>
    </div>
  );
}
