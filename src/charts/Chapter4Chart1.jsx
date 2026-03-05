import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function Chapter4Chart1({ selectedCountry }) {
  const ref = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 60, right: 160, bottom: 80, left: 80 },
          width = 700 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    Promise.all([
      d3.csv("/data/life_expectancy.csv", d3.autoType),
      d3.csv("/data/countries.csv", d3.autoType)
    ]).then(([lifeData, countryMeta]) => {

      const selectedMeta = countryMeta.find(d => d.Country === selectedCountry);
      if (!selectedMeta) return;

      const incomeGroup = selectedMeta.Category;

      const peerCountries = countryMeta
        .filter(d => d.Category === incomeGroup)
        .map(d => d.Country)
        .filter(c => c !== selectedCountry)
        .slice(0, 4);

      const groupsToShow = [selectedCountry, ...peerCountries];

      const filtered = lifeData.filter(
        d => groupsToShow.includes(d.Country) && d.Year >= 2000 && d.Year <= 2023
      );

      if (!filtered.length) return;

      // SCALES
      const x = d3.scaleLinear().domain([2000, 2023]).range([0, width]);
      const y = d3.scaleLinear()
        .domain([
          d3.min(filtered, d => d["Life expectancy"]) - 2,
          d3.max(filtered, d => d["Life expectancy"]) + 2
        ])
        .range([height, 0]);

      const color = d3.scaleOrdinal()
        .domain(groupsToShow)
        .range(["#d62728", "#b0b0b0", "#b0b0b0", "#b0b0b0", "#b0b0b0"]);

      // AXES
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g").call(d3.axisLeft(y));

      // LINE GENERATOR
      const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d["Life expectancy"]));

      const grouped = d3.group(filtered, d => d.Country);

      // LINES + END ANNOTATIONS
      grouped.forEach((values, key) => {
        svg.append("path")
          .datum(values)
          .attr("fill", "none")
          .attr("stroke", color(key))
          .attr("stroke-width", key === selectedCountry ? 3.5 : 2)
          .attr("d", line);

        const last = values[values.length - 1];
        svg.append("text")
          .attr("x", x(last.Year) + 6)
          .attr("y", y(last["Life expectancy"]))
          .style("font-size", "11px")
          .style("fill", color(key))
          .text(key);
      });

      // TITLE
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text(`Life Expectancy: ${incomeGroup} Countries`);

      // AXIS LABELS
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .text("Year");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("Life expectancy (years)");

      // -------------------------
      // LEGEND BELOW GRAPH
      // -------------------------
      const legend = svg.append("g")
        .attr("transform", `translate(0, ${height + 60})`);

      // Selected country
      legend.append("circle")
        .attr("r", 6)
        .attr("fill", "#d62728");

      legend.append("text")
        .attr("x", 12)
        .attr("y", 4)
        .style("font-size", "12px")
        .text(selectedCountry);

      // Peer countries
      legend.append("circle")
        .attr("cx", 160)
        .attr("r", 6)
        .attr("fill", "#b0b0b0");

      legend.append("text")
        .attr("x", 172)
        .attr("y", 4)
        .style("font-size", "12px")
        .text(`Peer countries in ${incomeGroup}`);

      // -------------------------
      // TOOLTIP LOGIC
      // -------------------------
      const tooltip = d3.select(tooltipRef.current);
      const bisectYear = d3.bisector(d => d.Year).left;

      const focusLine = svg.append("line")
        .attr("stroke", "#aaa")
        .attr("y1", 0)
        .attr("y2", height)
        .style("opacity", 0);

      const focusDots = svg.selectAll(".focus-dot")
        .data(groupsToShow)
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("fill", d => color(d))
        .style("opacity", 0);

      const overlay = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all");

      overlay.on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        const year = Math.round(x.invert(mx));

        focusLine
          .attr("x1", x(year))
          .attr("x2", x(year))
          .style("opacity", 1);

        const rows = [];
        groupsToShow.forEach((name, i) => {
          const series = grouped.get(name);
          const index = bisectYear(series, year);
          const d0 = series[index - 1];
          const d1 = series[index];
          const d =
            !d0 ? d1 :
            !d1 ? d0 :
            year - d0.Year > d1.Year - year ? d1 : d0;
          if (!d) return;

          const val = d["Life expectancy"];
          rows.push(`<span style="color:${color(name)}">●</span> <strong>${name}</strong>: ${val.toFixed(1)}`);

          focusDots.filter((_, j) => j === i)
            .attr("cx", x(d.Year))
            .attr("cy", y(val))
            .style("opacity", 1);
        });

        tooltip
          .style("opacity", 1)
          .html(`<strong>${year}</strong><br>${rows.join("<br>")}`)
          .style("left", x(year) + margin.left + 30 + "px")
          .style("top", margin.top + "px");
      });

      overlay.on("mouseout", () => {
        focusLine.style("opacity", 0);
        focusDots.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
    });
  }, [selectedCountry]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref}></div>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px 10px",
          fontSize: "12px",
          pointerEvents: "none",
          opacity: 0,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}