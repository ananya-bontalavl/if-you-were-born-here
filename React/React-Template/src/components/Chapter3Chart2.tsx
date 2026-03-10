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

    const margin = { top: 40, right: 180, bottom: 60, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data: CountryData[] = GNI_DATA.map((d: any) => ({
      ...d,
      gni3: +d.gni3 
    })).filter(d => !isNaN(d.gni3));

    const categories = ["Low Income", "Lower Middle Income", "Upper Middle Income", "High Income"];
    
    const x = d3.scalePoint<string>().domain(categories).range([0, width]).padding(0.5);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.gni3) || 60000]).nice().range([height, 0]);
    const color = d3.scaleOrdinal<string>().domain(categories).range(["#e63946", "#f4a261", "#2a9d8f", "#1f77b4"]);

    svg.append("g").attr("opacity", 0.1).call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));
    const simulation = d3.forceSimulation<CountryData>(data)
      .force("x", d3.forceX<CountryData>(d => x(d.category) || 0).strength(1))
      .force("y", d3.forceY<CountryData>(d => y(d.gni3)).strength(1))
      .force("collide", d3.forceCollide(6))
      .stop();

    for (let i = 0; i < 200; ++i) simulation.tick();

    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => d.x || 0)
      .attr("cy", d => d.y || 0)
      .attr("r", d => d.country === selectedCountry.name ? 10 : 5.5)
      .attr("fill", d => d.country === selectedCountry.name ? "#fff" : color(d.category))
      .attr("stroke", d => d.country === selectedCountry.name ? "#000" : "none")
      .attr("stroke-width", 2)
      .attr("opacity", d => d.country === selectedCountry.name ? 1 : 0.7)
      .on("mousemove", (event, d) => {
        const [xPos, yPos] = d3.pointer(event, ref.current);
        tooltip.style("opacity", 1)
          .html(`<strong>${d.country}</strong><br/>GNI: $${Math.round(d.gni3).toLocaleString()}`)
          .style("left", (xPos + 15) + "px")
          .style("top", (yPos - 28) + "px");
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    const legend = svg.append("g").attr("transform", `translate(${width + 20}, 0)`);
    categories.forEach((cat, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      g.append("circle").attr("r", 6).attr("fill", color(cat));
      g.append("text").attr("x", 10).attr("y", 5).attr("fill", "#a2a2a2").style("font-size", "15px").style("font-weight", "600").text(cat);
    });

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x)).attr("color", "#8e8e8e") .style("font-size", "18px");
    svg.append("g").call(d3.axisLeft(y).ticks(5)).attr("color", "#8e8e8e").style("font-size", "20px");
  }, [selectedCountry]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={ref}></div>
      <div ref={tooltipRef} style={{ position: "absolute", background: "white", color: "black", padding: "8px", borderRadius: "4px", pointerEvents: "none", opacity: 0, zIndex: 1000, fontSize: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }} />
    </div>
  );
}