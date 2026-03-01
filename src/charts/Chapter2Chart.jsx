import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function Chapter2Chart({ countryData, countriesData }) {
  const ladderRef = useRef(null);
  const rankingRef = useRef(null);

  useEffect(() => {
    if (!countryData || !countriesData) return;

  
    d3.select(ladderRef.current).selectAll("*").remove();
    d3.select(rankingRef.current).selectAll("*").remove();

    const years = +countryData["Years of Schooling(2000-2023)"];

    // ----- LADDER LOGIC -----
    let level;
    if (years >= 16) level = 4;
    else if (years >= 12) level = 3;
    else if (years >= 8) level = 2;
    else if (years >= 5) level = 1;
    else level = 0;

    const stages = [
      "Did not complete primary school",
      "Completed primary school",
      "Completed middle school",
      "Completed high school",
      "Completed university"
    ];

    const ladderSteps = [
      "Primary School",
      "Middle School",
      "High School",
      "University"
    ];

    const ladderWidth = 350;
    const ladderHeight = 280;
    const stepHeight = 50;

    const svg = d3.select(ladderRef.current)
      .append("svg")
      .attr("width", ladderWidth)
      .attr("height", ladderHeight);

    const g = svg.append("g")
      .attr("transform", "translate(120,30)");

    const rungs = g.selectAll("rect")
      .data(ladderSteps)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => (ladderSteps.length - 1 - i) * stepHeight)
      .attr("width", 150)
      .attr("height", stepHeight - 10)
      .attr("rx", 6)
      .attr("fill", "#e0e0e0");

    rungs
      .filter((d, i) => i < level)
      .transition()
      .delay((d, i) => i * 400)
      .duration(600)
      .attr("fill", "#4c78a8");

    g.selectAll("text")
      .data(ladderSteps)
      .enter()
      .append("text")
      .attr("x", -10)
      .attr("y", (d, i) => (ladderSteps.length - 1 - i) * stepHeight + 25)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .style("font-size", "13px")
      .text(d => d);

    d3.select(ladderRef.current)
      .append("p")
      .style("margin-top", "8px")
      .style("font-weight", "500")
      .text(`Average years of schooling: ${years.toFixed(1)}. You ${stages[level].toLowerCase()}.`);

    // ----- RANKING LOGIC -----
    const group = countryData.Category;

    const ranked = countriesData
      .filter(d => d.Category === group)
      .sort((a, b) =>
        b["Years of Schooling(2000-2023)"] - a["Years of Schooling(2000-2023)"]
      )
      .slice(0, 8);

    const margin = { top: 10, right: 60, bottom: 10, left: 140 };
    const rWidth = 400;
    const rHeight = ranked.length * 30;
    const innerWidth = rWidth - margin.left - margin.right;

    const rSvg = d3.select(rankingRef.current)
      .append("svg")
      .attr("width", rWidth)
      .attr("height", rHeight + margin.top + margin.bottom);

    const gRank = rSvg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(ranked, d => d["Years of Schooling(2000-2023)"])])
      .range([0, innerWidth]);

    const y = d3.scaleBand()
      .domain(ranked.map(d => d.Country))
      .range([0, rHeight])
      .padding(0.2);

    // Bars
    gRank.selectAll("rect")
      .data(ranked)
      .enter()
      .append("rect")
      .attr("y", d => y(d.Country))
      .attr("height", y.bandwidth())
      .attr("width", d => x(d["Years of Schooling(2000-2023)"]))
      .attr("fill", d =>
        d.Country === countryData.Country ? "#f28e2b" : "#9ecae9"
      );

    // Country labels
    gRank.selectAll("text.label")
      .data(ranked)
      .enter()
      .append("text")
      .attr("x", -10)
      .attr("y", d => y(d.Country) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("alignment-baseline", "middle")
      .style("font-size", "12px")
      .text(d => d.Country);

    // Value labels
    gRank.selectAll("text.value")
      .data(ranked)
      .enter()
      .append("text")
      .attr("x", d => x(d["Years of Schooling(2000-2023)"]) + 6)
      .attr("y", d => y(d.Country) + y.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .style("font-size", "11px")
      .text(d => d["Years of Schooling(2000-2023)"].toFixed(1));

  }, [countryData, countriesData]);

  return (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      <div ref={ladderRef}></div>
      <div ref={rankingRef}></div>
    </div>
  );
}