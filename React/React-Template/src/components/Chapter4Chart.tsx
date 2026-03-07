import React, { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { LIFE_EXPECTANCY_DATA } from "../data/female_male_life_expenctancy";
import { LIFE_EXPECTANCY_YEARLY_DATA } from "../data/life_expectancy_yearly";
import { GNI_DATA } from "../data/gni_processed";

interface Props {
  countryData: {
    name: string;
    color: string;
  };
}

export default function Chapter4Chart({ countryData }: Props) {
  const [view, setView] = useState<"gender" | "peers">("gender");
  const chartRef = useRef<HTMLDivElement>(null);

  // 1. Identify the 5 countries in this economic bracket
  const peerInfo = useMemo(() => {
    // Sort all 20 countries by final GNI (GNI 3)
    const sorted = [...GNI_DATA].sort((a, b) => a.gni3 - b.gni3);
    
    // Find the index of the current country
    const index = sorted.findIndex(c => c.country === countryData.name);
    
    // Determine which bracket of 5 it falls into (0-4, 5-9, 10-14, 15-19)
    const bracketIndex = Math.floor(index / 5);
    const bracket = sorted.slice(bracketIndex * 5, (bracketIndex + 1) * 5);
    
    const labels = ["Low Income Bracket", "Lower-Middle Bracket", "Upper-Middle Bracket", "High Income Bracket"];
    
    return {
      peers: bracket.map(d => d.country),
      label: labels[bracketIndex]
    };
  }, [countryData.name]);

  useEffect(() => {
    if (!chartRef.current) return;
    d3.select(chartRef.current).selectAll("*").remove();

    // Responsive dimensions
    const margin = { top: 60, right: 100, bottom: 80, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    if (view === "gender") {
      // --- GENDER CHART LOGIC ---
      const data = LIFE_EXPECTANCY_DATA.filter(d => d.country === countryData.name && d.year >= 2000);
      
      const x = d3.scaleLinear().domain([2000, 2023]).range([0, width]);
      const y = d3.scaleLinear()
        .domain([d3.min(data, d => Math.min(d.men, d.women))! - 2, d3.max(data, d => Math.max(d.men, d.women))! + 2])
        .range([height, 0]);

      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      svg.append("g").call(d3.axisLeft(y));

      const line = (key: 'men' | 'women') => d3.line<any>().x(d => x(d.year)).y(d => y(d[key]));

      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#4e79a7").attr("stroke-width", 4).attr("d", line('men'));
      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#e15759").attr("stroke-width", 4).attr("d", line('women'));

      // Legend
      const leg = svg.append("g").attr("transform", `translate(${width - 100}, 0)`);
      leg.append("text").attr("y", 0).text("● Women").style("fill", "#e15759").style("font-weight", "bold");
      leg.append("text").attr("y", 25).text("● Men").style("fill", "#4e79a7").style("font-weight", "bold");

      svg.append("text").attr("x", width/2).attr("y", -25).attr("text-anchor", "middle")
        .style("fill", "#fff").style("font-size", "22px").style("font-weight", "900")
        .text(`${countryData.name.toUpperCase()}: THE GENDER GAP`);

    } else {
      // --- PEER COUNTRIES CHART LOGIC ---
      const data = LIFE_EXPECTANCY_YEARLY_DATA.filter(d => peerInfo.peers.includes(d.country) && d.year >= 2000);

      const x = d3.scaleLinear().domain([2000, 2023]).range([0, width]);
      const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.lifeExpectancy)! - 2, d3.max(data, d => d.lifeExpectancy)! + 2])
        .range([height, 0]);

      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      svg.append("g").call(d3.axisLeft(y));

      const grouped = d3.group(data, d => d.country);
      const line = d3.line<any>().x(d => x(d.year)).y(d => y(d.lifeExpectancy));

      grouped.forEach((values, key) => {
        const isMain = key === countryData.name;
        svg.append("path").datum(values).attr("fill", "none")
          .attr("stroke", isMain ? countryData.color : "#e9e8e8")
          .attr("stroke-width", isMain ? 5 : 2)
          .attr("opacity", isMain ? 1 : 0.4)
          .attr("d", line);

        const last = values[values.length - 1];
        svg.append("text")
          .attr("x", x(last.year) + 8)
          .attr("y", y(last.lifeExpectancy))
          .style("font-size", isMain ? "14px" : "11px")
          .style("font-weight", isMain ? "1000" : "500")
          .style("fill", isMain ? countryData.color : "#e9e8e8")
          .text(key);
      });

      svg.append("text").attr("x", width/2).attr("y", -25).attr("text-anchor", "middle")
        .style("fill", "#fff").style("font-size", "22px").style("font-weight", "900")
        .text(`${peerInfo.label.toUpperCase()}`);
    }

    // Common Axis Labels
    svg.append("text").attr("x", width/2).attr("y", height + 50).attr("text-anchor", "middle").style("fill", "#b8b8b8").text("Year");
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", -45).attr("text-anchor", "middle").style("fill", "#b8b8b8").text("Average Life Expectancy");

  }, [view, countryData, peerInfo]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px" }}>
      
      {/* Main Chart Container */}
      <div style={{ 
        width: "100%", 
        backgroundColor: "rgba(255,255,255,0.03)", 
        borderRadius: "24px", 
        padding: "40px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}>
        <div ref={chartRef}></div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setView(view === "gender" ? "peers" : "gender")}
        style={{
          padding: "16px 40px",
          borderRadius: "100px",
          border: `2px solid ${countryData.color}`,
          backgroundColor: "transparent",
          color: countryData.color,
          fontWeight: 900,
          fontSize: "13px",
          letterSpacing: "2px",
          cursor: "pointer",
          transition: "all 0.3s",
          textTransform: "uppercase"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = countryData.color;
          e.currentTarget.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = countryData.color;
        }}
      >
        {view === "gender" ? "Compare with Peer Countries →" : "← Back to Gender Statistics"}
      </button>

      <p style={{ color: countryData.color, fontSize: "15px", maxWidth: "600px", textAlign: "center", lineHeight: "1.5" }}>
        {view === "gender" 
          ? "This chart visualizes the difference in life expectancy between men and women in your selected country since 2000."
          : `Showing your country alongside the other 4 countries in the same economic category ($${peerInfo.label}).`}
      </p>
    </div>
  );
}