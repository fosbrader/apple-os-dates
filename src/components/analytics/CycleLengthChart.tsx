"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface VersionStat {
  platform: string;
  platformColor: string;
  version: string;
  cycleDays: number | null;
}

interface CycleLengthChartProps {
  versions: VersionStat[];
}

const MARGIN = { top: 20, right: 30, bottom: 60, left: 50 };

export function CycleLengthChart({ versions }: CycleLengthChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || versions.length === 0)
      return;

    const width = containerRef.current.clientWidth;
    const height = 300;

    const iosVersions = versions
      .filter((v) => v.platform === "iOS" && v.cycleDays !== null)
      .sort((a, b) =>
        a.version.localeCompare(b.version, undefined, { numeric: true })
      );

    if (iosVersions.length === 0) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(iosVersions.map((v) => v.version))
      .range([MARGIN.left, width - MARGIN.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(iosVersions, (v) => v.cycleDays!) || 120])
      .nice()
      .range([height - MARGIN.bottom, MARGIN.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - MARGIN.bottom})`)
      .call(d3.axisBottom(x))
      .attr("color", "var(--text-tertiary)")
      .selectAll("text")
      .attr("fill", "var(--text-secondary)")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("font-size", "10px");

    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "var(--text-tertiary)")
      .selectAll("text")
      .attr("fill", "var(--text-secondary)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 12)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-tertiary)")
      .attr("font-size", "11px")
      .text("Days");

    svg
      .selectAll(".bar")
      .data(iosVersions)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.version)!)
      .attr("y", (d) => y(d.cycleDays!))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.cycleDays!))
      .attr("fill", (d) => d.platformColor)
      .attr("opacity", 0.7)
      .attr("rx", 3);

    const avg =
      iosVersions.reduce((sum, v) => sum + v.cycleDays!, 0) /
      iosVersions.length;

    svg
      .append("line")
      .attr("x1", MARGIN.left)
      .attr("x2", width - MARGIN.right)
      .attr("y1", y(avg))
      .attr("y2", y(avg))
      .attr("stroke", "var(--milestone-rc)")
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.6);

    svg
      .append("text")
      .attr("x", width - MARGIN.right - 4)
      .attr("y", y(avg) - 6)
      .attr("text-anchor", "end")
      .attr("fill", "var(--milestone-rc)")
      .attr("font-size", "10px")
      .text(`avg: ${Math.round(avg)}d`);
  }, [versions]);

  return (
    <div ref={containerRef} className="surface p-4">
      <svg ref={svgRef} />
      <p className="text-xs text-[var(--text-tertiary)] mt-2 text-center">
        iOS beta cycle duration (Beta 1 to Public release)
      </p>
    </div>
  );
}
