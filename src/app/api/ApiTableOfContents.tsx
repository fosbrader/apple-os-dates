"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PUBLIC_API_DATASET_NAMES } from "@/lib/public-api/types";
import styles from "./api-reference.module.css";

const sections = [
  { id: "start", label: "Start" },
  { id: "responses", label: "Responses" },
  { id: "records", label: "Record endpoints" },
  ...PUBLIC_API_DATASET_NAMES.map((dataset) => ({
    id: dataset,
    label: dataset[0].toUpperCase() + dataset.slice(1),
  })),
  { id: "search", label: "Search" },
  { id: "errors", label: "Errors" },
  { id: "rules", label: "Rules and rights" },
];

export function ApiTableOfContents() {
  const [activeId, setActiveId] = useState("start");

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)
          .at(0);
        if (current?.target.id) setActiveId(current.target.id);
      },
      { rootMargin: "-18% 0px -72% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const links = (
    <>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`${styles.tocLink} ${
            activeId === section.id ? styles.tocLinkActive : ""
          }`}
          aria-current={activeId === section.id ? "location" : undefined}
        >
          {section.label}
        </a>
      ))}
      <span className={styles.tocRule} />
      <Link href="/exports/" className={styles.tocLink}>
        Bulk exports
      </Link>
      <a href="/api/v1/openapi.json" className={styles.tocLink}>
        OpenAPI JSON
      </a>
    </>
  );

  return (
    <>
      <nav className={styles.toc} aria-label="API reference sections">
        <p>On this page</p>
        {links}
      </nav>
      <details className={styles.mobileToc}>
        <summary>On this page</summary>
        <nav aria-label="API reference sections">{links}</nav>
      </details>
    </>
  );
}
