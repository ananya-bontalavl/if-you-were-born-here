import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function ParallelPlot({ selectedCountry }) {
  const svgRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const width = 1000;
    const height = 520;
    const margin = { top: 60, right: 80, bottom: 100, left: 80 };

    function cleanCategory(cat) {
      const c = cat?.trim().toLowerCase();
      if (c.includes("high") && !c.includes("middle")) return "high income";
      if (c.includes("upper")) return "upper middle income";
      if (c.includes("lower middle")) return "lower middle income";
      if (c.includes("low")) return "low income";
      return null;
    }

    d3.csv("/data/countries.csv", d => ({
      Country: d.Country,
      Category: cleanCategory(d.Category),
      ChildMortality: +d["Child Mortality(per 100)(2000- 2023)"],
      GNI: +d["GNI adjusted with PPP(2000-2023)"],
      Education: +d["Years of Schooling(2000-2023)"],
      LifeExpectancy: +d["Life Expectancy(2000-2023)"]
    })).then(rawData => {

      const data = rawData.filter(d =>
        d.Category &&
        !isNaN(d.ChildMortality) &&
        !isNaN(d.GNI) &&
        !isNaN(d.Education) &&
        !isNaN(d.LifeExpectancy)
      );

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const dimensions = ["ChildMortality", "GNI", "Education", "LifeExpectancy"];

      const labels = {
        ChildMortality: "Child Mortality ↓",
        GNI: "GNI (PPP $)",
        Education: "Years of Schooling",
        LifeExpectancy: "Life Expectancy"
      };

      const yScales = {};
      dimensions.forEach(dim => {
        const extent = d3.extent(data, d => d[dim]);
        yScales[dim] = d3.scaleLinear()
          .domain(dim === "ChildMortality" ? [extent[1], extent[0]] : extent)
          .range([innerHeight, 0])
          .nice();
      });

      const xScale = d3.scalePoint()
        .domain(dimensions)
        .range([0, innerWidth])
        .padding(0.5);

      const colorScale = d3.scaleOrdinal()
        .domain(["high income","upper middle income","lower middle income","low income"])
        .range(["#4C78A8","#59A14F","#F2BE3E","#E15759"]);

      const line = d3.line().curve(d3.curveMonotoneX);

      function path(d) {
        return line(dimensions.map(dim => [
          xScale(dim),
          yScales[dim](d[dim])
        ]));
      }

      // ---- TOOLTIP ----
      const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "8px 10px")
        .style("border-radius", "6px")
        .style("box-shadow", "0 4px 12px rgba(0,0,0,0.15)")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

      // background axes
      dimensions.forEach(dim => {
        g.append("line")
          .attr("x1", xScale(dim))
          .attr("x2", xScale(dim))
          .attr("y1", 0)
          .attr("y2", innerHeight)
          .attr("stroke", "#e5e7eb")
          .attr("stroke-dasharray", "4 4");
      });

      // ---- LINES ----
      const lines = g.selectAll(".country-line")
        .data(data)
        .join("path")
        .attr("class", "country-line")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", d => colorScale(d.Category))
        .attr("stroke-width", d => d.Country === selectedCountry ? 4 : 2)
        .attr("opacity", d => {
          if (d.Country === selectedCountry) return 1;
          if (selectedCategory === "all") return 0.6;
          return d.Category === selectedCategory ? 0.85 : 0.15;
        });

      // ---- TOOLTIP INTERACTION ----
      lines
        .on("mouseover", function (event, d) {
          lines.attr("opacity", 0.1);

          d3.select(this)
            .attr("stroke-width", 4)
            .attr("opacity", 1);

          tooltip
            .style("opacity", 1)
            .html(`
              <strong>${d.Country}</strong><br/>
              Child mortality: ${d.ChildMortality}<br/>
              GNI (PPP): ${d.GNI}<br/>
              Schooling: ${d.Education}<br/>
              Life expectancy: ${d.LifeExpectancy}
            `);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + 12 + "px")
            .style("top", event.pageY + 12 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);

          lines
            .attr("stroke-width", d => d.Country === selectedCountry ? 4 : 2)
            .attr("opacity", d => {
              if (d.Country === selectedCountry) return 1;
              if (selectedCategory === "all") return 0.6;
              return d.Category === selectedCategory ? 0.85 : 0.15;
            });
        });

      // ---- AXES ----
      dimensions.forEach(dim => {
        const axis = d3.axisLeft(yScales[dim]);
        const axisGroup = g.append("g")
          .attr("transform", `translate(${xScale(dim)},0)`)
          .call(axis);

        axisGroup.selectAll("path, line").attr("stroke", "#ccc");
        axisGroup.selectAll("text")
          .attr("fill", "#6b7280")
          .style("font-size", "11px");

        axisGroup.append("text")
          .attr("y", -20)
          .attr("text-anchor", "middle")
          .style("fill", "#111")
          .style("font-weight", "600")
          .text(labels[dim]);
      });

      // ---- LEGEND ----
      const legend = svg.append("g")
        .attr("transform", `translate(${width / 2 - 300}, ${height - 40})`);

      const categories = colorScale.domain();

      categories.forEach((cat, i) => {
        const row = legend.append("g")
          .attr("transform", `translate(${i * 180}, 0)`);

        row.append("line")
          .attr("x1", 0)
          .attr("x2", 25)
          .attr("stroke", colorScale(cat))
          .attr("stroke-width", 3);

        row.append("text")
          .attr("x", 30)
          .attr("y", 4)
          .text(
            cat
              .split(" ")
              .map(w => w[0].toUpperCase() + w.slice(1))
              .join(" ")
          )
          .style("font-size", "12px")
          .style("fill", "#444");
      });

    });

    return () => {
      d3.selectAll(".tooltip").remove();
    };

  }, [selectedCountry, selectedCategory]);

  return (
    <>
      <label style={{ fontSize: "14px", display: "block", marginBottom: "6px" }}>
        Compare with Income Groups:
      </label>

      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="all">All Groups</option>
        <option value="high income">High income</option>
        <option value="upper middle income">Upper middle income</option>
        <option value="lower middle income">Lower middle income</option>
        <option value="low income">Low income</option>
      </select>

      <svg ref={svgRef}></svg>
    </>
  );
}

