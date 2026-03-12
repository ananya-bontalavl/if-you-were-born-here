import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function Chapter3Chart2({ selectedCountry }) {

  const ref = useRef();
  const tooltipRef = useRef();

  useEffect(() => {

    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 60, right: 200, bottom: 80, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 420 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("/data/countries.csv", d3.autoType).then(data => {

      const categories = [
        "Low Income",
        "Lower Middle Income",
        "Upper Middle Income",
        "High Income"
      ];

      const x = d3.scalePoint()
        .domain(categories)
        .range([0, width])
        .padding(0.5);

      const y = d3.scaleLinear()
        .domain([
          0,
          d3.max(data, d => d["GNI adjusted with PPP(2000-2023)"])
        ])
        .nice()
        .range([height, 0]);

      const color = d3.scaleOrdinal()
        .domain(categories)
        .range([
          "#e63946",
          "#f4a261",
          "#2a9d8f",
          "#1f77b4"
        ]);

      // grid lines
      svg.append("g")
        .call(
          d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        )
        .selectAll("line")
        .attr("stroke", "#e0e0e0");

      // y axis
      svg.append("g")
        .call(d3.axisLeft(y));

      // x axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      // axis labels
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 55)
        .attr("text-anchor", "middle")
        .text("Income Category");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("GNI adjusted with PPP");

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Income Distribution by Category");

      // beeswarm simulation
      const simulation = d3.forceSimulation(data)
  .force("x", d3.forceX(d => x(d.Category)).strength(1))
  .force("y", d3.forceY(d => y(d["GNI adjusted with PPP(2000-2023)"])).strength(1))
  .force("collide", d3.forceCollide(9))
  .force("boundary", () => {           
    data.forEach(d => {
      d.y = Math.min(d.y, height - 9); 
    });
  })
  .stop();

      for (let i = 0; i < 250; ++i) simulation.tick();

      const tooltip = d3.select(tooltipRef.current);

      svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => Math.min(d.y, height - 5)) 
        .attr("r", d => d.Country === selectedCountry ? 8 : 5)
        .attr("fill", d => color(d.Category))
        .attr("opacity", 0.85)
        .attr("stroke", d => d.Country === selectedCountry ? "black" : "none")
        .attr("stroke-width", 2)

        .on("mousemove", (event, d) => {
  const [xPos, yPos] = d3.pointer(event);
  tooltip
    .style("opacity", 1)
    .html(
      `<strong>${d.Country}</strong><br>
       Income Group: ${d.Category}<br>
       GNI: ${Math.round(d["GNI adjusted with PPP(2000-2023)"]).toLocaleString()}`
    )
    .style("left", (xPos + 100) + "px")
    .style("top", (yPos + 40) + "px");
})

        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);

      categories.forEach((cat, i) => {

        const row = legend.append("g")
          .attr("transform", `translate(0, ${i * 22})`);

        row.append("circle")
          .attr("r", 6)
          .attr("fill", color(cat));

        row.append("text")
          .attr("x", 12)
          .attr("y", 4)
          .style("font-size", "12px")
          .text(cat);

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
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        }}
      />

    </div>

  );

}