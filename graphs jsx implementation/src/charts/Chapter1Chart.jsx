import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function Chapter1Chart({ countryData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !countryData) return;

    d3.select(container).selectAll("*").remove();

    const mortality = +countryData["Child Mortality(per 100)(2000- 2023)"];
    const fullFaded = Math.floor(mortality);
    const partial = mortality - fullFaded;

    const cols = 10;
    const iconSize = 25;
    const gap = 6;

    const svg = d3.select(container)
      .append("svg")
      .attr("width", 350)
      .attr("height", 350);

    const g = svg.append("g").attr("transform", "translate(20,20)");

    const icons = g.selectAll("g")
      .data(d3.range(100))
      .enter()
      .append("g")
      .attr("transform", (d, i) => {
        const x = (i % cols) * (iconSize + gap);
        const y = Math.floor(i / cols) * (iconSize + gap);
        return `translate(${x},${y})`;
      });

    // base = survivor
    icons.append("rect")
      .attr("width", iconSize)
      .attr("height", iconSize)
      .attr("rx", 4)
      .attr("fill", "#4caf50");

    // overlay = mortality
    const overlay = icons.append("rect")
      .attr("width", (d, i) => i < fullFaded ? iconSize : i === fullFaded ? iconSize * partial : 0)
      .attr("height", iconSize)
      .attr("rx", 4)
      .attr("fill", "#d9534f")
      .attr("opacity", 0);

    // animate full red squares
    overlay.filter((d, i) => i < fullFaded)
      .transition().delay((d, i) => i * 60).duration(500)
      .attr("opacity", 0.95);

    // animate partial square
    if (partial > 0) {
      overlay.filter((d, i) => i === fullFaded)
        .transition().delay(fullFaded * 60).duration(500)
        .attr("opacity", 0.95);
    }

    // label
    d3.select(container)
      .append("p")
      .style("margin-top", "12px")
      .text(`Out of 100 children, about ${mortality.toFixed(2)} do not survive past age 5.`);

  }, [countryData]);

  return <div ref={containerRef}></div>;
}