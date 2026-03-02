import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Chapter4Chart({ selectedCountry }) {
  const ref = useRef();
  const tooltipRef = useRef();
  const [startYear, setStartYear] = useState(2000);

  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 60, right: 40, bottom: 220, left: 80 },
      width = 700 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("/data/life_expectancy.csv", d3.autoType).then((data) => {
      const groupsToShow = [
        selectedCountry,
        "World",
        "High income",
        "Upper middle income",
        "Lower middle income",
        "Low income",
      ];

      const filtered = data.filter(
        (d) =>
          groupsToShow.includes(d.Country) &&
          d.Year >= startYear &&
          d.Year <= 2023
      );

      if (!filtered.length) return;

      const grouped = d3.group(filtered, (d) => d.Country);

      const x = d3.scaleLinear().domain([startYear, 2023]).range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(filtered, (d) => d["Life expectancy"]) - 4,
          d3.max(filtered, (d) => d["Life expectancy"]) + 4,
        ])
        .range([height, 0]);

      // ---- AXES ----
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g").call(d3.axisLeft(y));

      // ---- AXIS LABELS ----
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Year");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Age (years)");

      const line = d3
        .line()
        .x((d) => x(d.Year))
        .y((d) => y(d["Life expectancy"]));

      const color = d3.scaleOrdinal().domain(groupsToShow).range([
        "#d62728",
        "#000000",
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#9467bd",
      ]);

      grouped.forEach((values, key) => {
        svg
          .append("path")
          .datum(values)
          .attr("fill", "none")
          .attr("stroke", color(key))
          .attr("stroke-width", key === selectedCountry ? 3 : 2)
          .attr("stroke-dasharray", key.includes("income") ? "4 4" : "0")
          .attr("d", line);
      });

      // ---- TITLE ----
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("How long will you live?");

      // ---- LEGEND ----
      const legend = svg
        .append("g")
        .attr("transform", `translate(${width / 2 - 180}, ${height + 90})`);

      groupsToShow.forEach((name, i) => {
        const g = legend
          .append("g")
          .attr(
            "transform",
            `translate(${(i % 2) * 200}, ${Math.floor(i / 2) * 22})`
          );

        g.append("line")
          .attr("x1", 0)
          .attr("x2", 25)
          .attr("stroke", color(name))
          .attr("stroke-width", name === selectedCountry ? 3 : 2)
          .attr("stroke-dasharray", name.includes("income") ? "4 4" : "0");

        g.append("text")
          .attr("x", 30)
          .attr("y", 4)
          .style("font-size", "11px")
          .text(name);
      });

      // ---- SENTENCE ----
      const countryVal = filtered.find(
        (d) => d.Country === selectedCountry && d.Year === startYear
      )?.["Life expectancy"];

      const worldVal = filtered.find(
        (d) => d.Country === "World" && d.Year === startYear
      )?.["Life expectancy"];

      if (countryVal != null && worldVal != null) {
        const diff = (countryVal - worldVal).toFixed(1);
        const text =
          diff > 0
            ? `${Math.abs(diff)} years longer than global average`
            : `${Math.abs(diff)} years shorter than global average`;

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height + 70)
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .style("font-weight", "bold")
          .text(text);
      }

      // ---- TOOLTIP ----
      const tooltip = d3.select(tooltipRef.current);
      const bisectYear = d3.bisector((d) => d.Year).left;

      const focusLine = svg
        .append("line")
        .attr("stroke", "#aaa")
        .attr("y1", 0)
        .attr("y2", height)
        .style("opacity", 0);

      const overlay = svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all");

      overlay
        .on("mousemove", (event) => {
          const [mx] = d3.pointer(event);
          const year = Math.round(x.invert(mx));

          focusLine
            .attr("x1", x(year))
            .attr("x2", x(year))
            .style("opacity", 1);

          const rows = groupsToShow.map((name) => {
            const seriesData = filtered.filter((d) => d.Country === name);
            const i = bisectYear(seriesData, year);
            const d0 = seriesData[i - 1];
            const d1 = seriesData[i];
            const d = !d0 ? d1 : !d1 ? d0 : year - d0.Year > d1.Year - year ? d1 : d0;
            const val = d?.["Life expectancy"];
            return val != null
              ? `<span style="color:${color(name)}">●</span> <strong>${name}</strong>: ${val.toFixed(1)}`
              : null;
          }).filter(Boolean);

          // Use offsetX/offsetY relative to the container
          const containerRect = ref.current.getBoundingClientRect();
          tooltip
            .style("opacity", "1")
            .style("z-index", "9999")
            .html(`<div style="margin-bottom:4px;font-weight:600">Year: ${year}</div>${rows.join("<br/>")}`)
            .style("left", (event.clientX - containerRect.left + 14) + "px")
            .style("top", (event.clientY - containerRect.top - 40) + "px");
        })
        .on("mouseout", () => {
          focusLine.style("opacity", 0);
          tooltip.style("opacity", "0");
        });
    });
  }, [selectedCountry, startYear]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div ref={ref}></div>

      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ccc",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          lineHeight: "1.8",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 9999,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      ></div>

      <div style={{ width: "700px", margin: "10px auto", textAlign: "center" }}>
        <label>
          Start year: <strong>{startYear}</strong>
        </label>
        <input
          type="range"
          min="2000"
          max="2023"
          value={startYear}
          onChange={(e) => setStartYear(+e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}