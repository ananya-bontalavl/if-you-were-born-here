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
    const sorted = [...GNI_DATA].sort((a, b) => a.gni3 - b.gni3);
    const index = sorted.findIndex((c) => c.country === countryData.name);
    const bracketIndex = Math.floor(index / 5);
    const bracket = sorted.slice(bracketIndex * 5, (bracketIndex + 1) * 5);
    const labels = [
      "Low Income Bracket",
      "Lower-Middle Bracket",
      "Upper-Middle Bracket",
      "High Income Bracket",
    ];
    return {
      peers: bracket.map((d) => d.country),
      label: labels[bracketIndex],
    };
  }, [countryData.name]);

  useEffect(() => {
    if (!chartRef.current) return;
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 90, bottom: 20, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip setup
    let tooltip = d3.select(chartRef.current).select("#tooltip");
    if (tooltip.empty()) {
      tooltip = d3.select(chartRef.current)
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "rgba(255,255,255,0.95)")
        .style("color", "#111")
        .style("padding", "10px 14px")
        .style("border-radius", "8px")
        .style("font-size", "13px")
        .style("box-shadow", "0 4px 15px rgba(0,0,0,0.3)")
        .style("opacity", 0)
        .style("z-index", 100)
        .style("min-width", "140px");
    }

    const x = d3.scaleLinear().domain([2000, 2023]).range([0, width]);

    if (view === "gender") {
      // --- GENDER CHART LOGIC ---
      const data = LIFE_EXPECTANCY_DATA.filter((d) => d.country === countryData.name && d.year >= 2000);
      const y = d3.scaleLinear()
        .domain([d3.min(data, (d) => Math.min(d.men, d.women))! - 2, d3.max(data, (d) => Math.max(d.men, d.women))! + 2])
        .range([height, 0]);

      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      svg.append("g").call(d3.axisLeft(y));

      const line = (key: "men" | "women") => d3.line<any>().x((d) => x(d.year)).y((d) => y(d[key]));

      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#4e79a7").attr("stroke-width", 4).attr("d", line("men"));
      svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#e15759").attr("stroke-width", 4).attr("d", line("women"));

      // Labels for Gender Lines
      const last = data[data.length - 1];
      svg.append("text").attr("x", x(last.year) + 10).attr("y", y(last.women)).text("Women").style("fill", "#e15759").style("font-weight", "bold");
      svg.append("text").attr("x", x(last.year) + 10).attr("y", y(last.men)).text("Men").style("fill", "#4e79a7").style("font-weight", "bold");

      data.forEach((d) => {
        [
          { k: "women", c: "#e15759" },
          { k: "men", c: "#4e79a7" },
        ].forEach((type) => {
          svg
            .append("circle")
            .attr("cx", x(d.year))
            .attr("cy", y(d[type.k as keyof typeof d] as number))
            .attr("r", 10)
            .attr("opacity", 0)
            .style("cursor", "pointer")
            .on("mouseenter", () => {
              tooltip.style("opacity", 1).html(`
                <div style="font-weight:900; margin-bottom:4px; border-bottom:1px solid #ccc">${d.year}</div>
                <div style="color:#e15759">● Women: <b>${d.women.toFixed(
                  1
                )}</b></div>
                <div style="color:#4e79a7">● Men: <b>${d.men.toFixed(1)}</b></div>
              `);
            })
            .on("mousemove", (e) => tooltip.style("left", e.offsetX + 15 + "px").style("top", e.offsetY - 20 + "px"))
            .on("mouseleave", () => tooltip.style("opacity", 0));
        });
      });

      svg.append("text").attr("x", width/2).attr("y", -25).attr("text-anchor", "middle").style("fill", "#fff").style("font-size", "22px").style("font-weight", "900")
        .text(`${countryData.name.toUpperCase()}: THE GENDER GAP`);

    } else {
      // --- PEER COUNTRIES CHART LOGIC ---
      const data = LIFE_EXPECTANCY_YEARLY_DATA.filter(
        (d) => peerInfo.peers.includes(d.country) && d.year >= 2000
      );
      const y = d3.scaleLinear()
        .domain([d3.min(data, (d) => d.lifeExpectancy)! - 2, d3.max(data, (d) => d.lifeExpectancy)! + 2,
        ])
        .range([height, 0]);

      svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
      svg.append("g").call(d3.axisLeft(y));

      const grouped = d3.group(data, (d) => d.country);
      const line = d3.line<any>().x((d) => x(d.year)).y((d) => y(d.lifeExpectancy));

      // Draw lines
      grouped.forEach((values, key) => {
        const isMain = key === countryData.name;
        svg
          .append("path")
          .datum(values)
          .attr("fill", "none")
          .attr("stroke", isMain ? countryData.color : "#e9e8e8")
          .attr("stroke-width", isMain ? 5 : 2)
          .attr("opacity", isMain ? 1 : 0.4)
          .attr("d", line);
      });

      // Label positions
      interface LabelNode {
        country: string;
        x: number;
        y: number;
      }

      const labelsData: LabelNode[] = [];
      grouped.forEach((values, key) => {
        const last = values[values.length - 1];
        labelsData.push({ country: key, x: x(last.year) + 8, y: y(last.lifeExpectancy) });
      });

      const simulation = d3.forceSimulation(labelsData as any)
        .force("y", d3.forceY((d) => (d as LabelNode).y).strength(1))
        .force("collide", d3.forceCollide(14))
        .stop();

      for (let i = 0; i < 200; i++) simulation.tick();

      labelsData.forEach((node) => {
        const isMain = node.country === countryData.name;
        svg
          .append("text")
          .attr("x", node.x)
          .attr("y", node.y)
          .style("font-size", isMain ? "14px" : "11px")
          .style("font-weight", "bold")
          .style("fill", isMain ? countryData.color : "#e9e8e8")
          .text(node.country);
      });

      const focusLine = svg.append("line").attr("stroke", "#999").attr("stroke-width", 1).attr("y1", 0).attr("y2", height).style("opacity", 0);

      svg.append("rect").attr("width", width).attr("height", height).attr("fill", "none").attr("pointer-events", "all")
        .on("mousemove", (event) => {
          const year = Math.round(x.invert(d3.pointer(event)[0]));
          const filtered = data
            .filter((d) => d.year === year)
            .sort((a, b) => b.lifeExpectancy - a.lifeExpectancy);
          if (filtered.length === 0) return;
          let content = `<div style="font-weight:900; margin-bottom:6px; border-bottom:1px solid #ccc">${year}</div>`;
          filtered.forEach((d) => {
            const isMain = d.country === countryData.name;
            content += `<div style="color:${
              isMain ? countryData.color : "#444"
            }; font-weight:${isMain ? 900 : 400}; display:flex; justify-content:space-between; gap:10px">
              <span>● ${d.country}</span> <span><b>${d.lifeExpectancy.toFixed(
                1
              )}</b></span>
            </div>`;
          });

          tooltip.html(content).style("opacity", 1).style("left", event.offsetX + 15 + "px").style("top", event.offsetY - 20 + "px");
          focusLine.attr("x1", x(year)).attr("x2", x(year)).style("opacity", 1);
        })
        .on("mouseleave", () => { tooltip.style("opacity", 0); focusLine.style("opacity", 0); });

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-size", "22px")
        .style("font-weight", "900")
        .text(`${peerInfo.label.toUpperCase()}`);
    }

    // Common Axis Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .style("fill", "#b8b8b8")
      .text("Year");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -45)
      .attr("text-anchor", "middle")
      .style("fill", "#b8b8b8")
      .text("Life Expectancy");
  }, [view, countryData, peerInfo]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", position: "relative" }}>
      {/* Main Chart Container */}
      <div style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
        <div ref={chartRef}></div>
      </div>

      <button onClick={() => setView(view === "gender" ? "peers" : "gender")} style={{ padding: "16px 40px", borderRadius: "100px", border: `2px solid ${countryData.color}`, backgroundColor: "transparent", color: countryData.color, fontWeight: 900, fontSize: "13px", cursor: "pointer", transition: "0.3s", textTransform: "uppercase" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = countryData.color; e.currentTarget.style.color = "#000"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = countryData.color; }}>
        {view === "gender" ? "Compare with Peer Countries →" : "← Back to Gender Statistics"}
      </button>

      <p style={{ color: countryData.color, fontSize: "15px", maxWidth: "600px", textAlign: "center", fontWeight: 500 }}>
        {view === "gender" ? "This chart visualizes the difference in life expectancy between men and women in your country since 2000." : `Showing your country alongside the other 4 countries in the same economic category ${peerInfo.label}`}
      </p>
    </div>
  );
}