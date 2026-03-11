import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { GNI_DATA } from "../data/gni_processed";

interface CountryData extends d3.SimulationNodeDatum {
  country: string;
  category: string;
  gni3: number;
}

interface Props {
  selectedCountry: any;
}

export default function Chapter3Chart2({ selectedCountry }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 50, right: 200, bottom: 100, left: 90 };
    const width = 1100 - margin.left - margin.right;
    const height = 620 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", "100%")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data: CountryData[] = GNI_DATA.map((d: any) => ({
      ...d,
      gni3: +d.gni3,
    })).filter((d) => !isNaN(d.gni3));

    const categories = [
      "Low Income",
      "Lower Middle Income",
      "Upper Middle Income",
      "High Income",
    ];

    const x = d3
      .scalePoint<string>()
      .domain(categories)
      .range([0, width])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.gni3) || 60000])
      .nice()
      .range([height, 0]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(categories)
      .range(["#e63946", "#f4a261", "#2a9d8f", "#1f77b4"]);

    // GRIDLINES
    svg
      .append("g")
      .attr("opacity", 0.08)
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

    // GLOW FILTER
    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // BACKGROUND RANGE BANDS
    categories.forEach((cat) => {
      const values = data.filter((d) => d.category === cat).map((d) => d.gni3);
      const minVal = d3.min(values) ?? 0;
      const maxVal = d3.max(values) ?? 0;

      svg
        .append("rect")
        .attr("x", (x(cat) ?? 0) - 40)
        .attr("width", 80)
        .attr("y", y(maxVal))
        .attr("height", y(minVal) - y(maxVal))
        .attr("fill", color(cat))
        .attr("opacity", 0.07)
        .attr("rx", 12);
    });

    // BEESWARM
    const simulation = d3
      .forceSimulation<CountryData>(data)
      .force("x", d3.forceX<CountryData>((d) => x(d.category) ?? 0).strength(2))
      .force("y", d3.forceY<CountryData>((d) => y(d.gni3)).strength(1))
      .force("collide", d3.forceCollide(13))
      .stop();

    for (let i = 0; i < 300; ++i) simulation.tick();

    // Clamp dots so they don't cross the x-axis
    data.forEach((d) => {
      d.y = Math.min(d.y ?? 0, height - 10);
    });

    const tooltip = d3.select(tooltipRef.current);

    // MEDIAN LINES
    categories.forEach((cat) => {
      const values = data.filter((d) => d.category === cat).map((d) => d.gni3);
      const median = d3.median(values);
      if (!median) return;

      svg
        .append("line")
        .attr("x1", (x(cat) ?? 0) - 25)
        .attr("x2", (x(cat) ?? 0) + 25)
        .attr("y1", y(median))
        .attr("y2", y(median))
        .attr("stroke", "white")
        .attr("stroke-width", 2.5)
        .attr("opacity", 0.85);

      svg
        .append("text")
        .attr("x", (x(cat) ?? 0) + 30)
        .attr("y", y(median) + 4)
        .attr("fill", "#cccccc")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(`$${Math.round(median / 1000)}k`);
    });

    // SELECTED COUNTRY REFERENCE LINE
    const selectedData = data.find((d) => d.country === selectedCountry?.name);

    if (selectedData) {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(selectedData.gni3))
        .attr("y2", y(selectedData.gni3))
        .attr("stroke", "#ffffff")
        .attr("stroke-dasharray", "5,5")
        .attr("opacity", 0.5);

      svg
        .append("text")
        .attr("x", width + 6)
        .attr("y", y(selectedData.gni3) + 4)
        .attr("fill", "#ffffff")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .text(selectedCountry.name);
    }

    // DOTS
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x ?? 0)
      .attr("cy", height)
      .attr("r", 0)
      .attr("fill", (d) =>
        d.country === selectedCountry?.name ? "#ffffff" : color(d.category)
      )
      .attr("stroke", (d) =>
        d.country === selectedCountry?.name ? "#000" : "none"
      )
      .attr("stroke-width", 2)
      .attr("opacity", (d) =>
        d.country === selectedCountry?.name ? 1 : 0.78
      )
      .attr("filter", (d) =>
        d.country === selectedCountry?.name ? "url(#glow)" : null
      )
      .on("mousemove", (event, d) => {
        const [xPos, yPos] = d3.pointer(event, ref.current);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.country}</strong><br/>GNI: <b>$${Math.round(d.gni3).toLocaleString()}</b>`
          )
          .style("left", xPos + 15 + "px")
          .style("top", yPos - 28 + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0))
      .transition()
      .duration(600)
      .delay((_, i) => i * 4)
      .attr("cy", (d) => d.y ?? 0)
      .attr("r", (d) => (d.country === selectedCountry?.name ? 14 : 10));

    // LEGEND
    const legend = svg.append("g").attr("transform", `translate(${width + 20}, 0)`);

    categories.forEach((cat, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 28})`);
      g.append("circle").attr("r", 6).attr("fill", color(cat));
      g.append("text")
        .attr("x", 14)
        .attr("y", 5)
        .attr("fill", "#e0e0e0")
        .style("font-size", "13px")
        .style("font-weight", "600")
        .text(cat);
    });

    // X AXIS
    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("color", "#e0e0e0")
      .style("font-size", "14px")
      .style("font-weight", "600");

    // Wrap x-axis labels
    xAxis.selectAll(".tick text").call((text) => {
      text.each(function () {
        const t = d3.select(this);
        const words = (t.text() || "").split(" ");
        if (words.length <= 2) return;
        t.text("");
        words.forEach((word, i) => {
          t.append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? "0.8em" : "1.1em")
            .text(word);
        });
      });
    });

    // Y AXIS
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(6))
      .attr("color", "#e0e0e0")
      .style("font-size", "14px")
      .style("font-weight", "600");

    // Y LABEL
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -65)
      .attr("text-anchor", "middle")
      .attr("fill", "#e0e0e0")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text("GNI per Capita (PPP Adjusted USD)");

    // X LABEL
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 80)
      .attr("text-anchor", "middle")
      .attr("fill", "#e0e0e0")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text("World Bank Income Category");

  }, [selectedCountry]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} />
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "white",
          color: "black",
          padding: "8px 10px",
          borderRadius: "4px",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 1000,
          fontSize: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
}