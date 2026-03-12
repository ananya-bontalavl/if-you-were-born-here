import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function Chapter3Chart({ countryData }) {
  const stackRef = useRef(null);

  useEffect(() => {
    if (!countryData) return;
    d3.select(stackRef.current).selectAll("*").remove();

    const gni = +countryData["GNI adjusted with PPP(2000-2023)"];

    let description;
    if (gni < 3000)
  description = "Most of your income goes toward food and basic shelter — little else is guaranteed. \
Healthcare, education, and saving for the future are largely out of reach ";

else if (gni < 8000)
  description = "You can meet basic needs, but financial shocks, an illness, a job loss, can be devastating. \
Luxuries are rare, and long-term planning is a privilege you rarely have. \
Around half the world's population lives at or below this income level.";

else if (gni < 15000)
  description = "Life is more stable, but comfort is still something you work hard to maintain. \
You may afford modest savings or small pleasures, but major expenses require real sacrifice. \
You earn more than roughly 70% of people on Earth.";

else if (gni < 30000)
  description = "You have real financial breathing room , savings, leisure, and security are within reach. \
Most daily stresses aren't about survival, but about choices. \
You are in the global top 20% by income.";

else
  description = "Financial anxiety is largely removed from your daily life. \
You can afford comfort, opportunity, and security that billions of people will never experience. \
You are in the global top 5% — your income exceeds that of 95% of the world's population.";
    const segments = [
      { label: "Survival", color: "#f28e8e", min: 0,     max: 3000  },
      { label: "Basic",    color: "#f6b48f", min: 3000,  max: 8000  },
      { label: "Stable",   color: "#f9e2a7", min: 8000,  max: 15000 },
      { label: "Comfortable", color: "#b7d6ea", min: 15000, max: 30000 },
      { label: "Wealthy",  color: "#7da0c9", min: 30000, max: 60000 },
    ];

    const width = 600;
    const height = 180;
    const barHeight = 40;
    const margin = { top: 60, right: 20, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;

    const svg = d3.select(stackRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const barWidth = innerWidth / segments.length;

    // Scale that maps actual GNI value → x position within equal-width bars
    // by finding which segment it falls in, then interpolating within that segment
    const gniToX = (val) => {
      const idx = segments.findIndex(s => val <= s.max);
      const i = idx < 0 ? segments.length - 1 : idx;
      const seg = segments[i];
      const t = (val - seg.min) / (seg.max - seg.min); 
      return i * barWidth + t * barWidth;
    };

    // Draw bars
    segments.forEach((seg, i) => {
      g.append("rect")
        .attr("x", i * barWidth)
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("rx", i === 0 ? 6 : i === segments.length - 1 ? 6 : 0)
        .attr("fill", seg.color);

      g.append("text")
        .attr("x", i * barWidth + barWidth / 2)
        .attr("y", barHeight / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#222")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .text(seg.label);
    });

    // Highlight current category
    const categoryIndex = segments.findIndex(seg => gni <= seg.max);
    if (categoryIndex >= 0) {
      g.append("rect")
        .attr("x", categoryIndex * barWidth)
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("rx", 0)
        .attr("fill", "rgba(0,0,0,0.12)");
    }

    // X-axis: tick at each segment boundary using equal-width positions
    const boundaries = [0, ...segments.map(s => s.max)];
    const boundaryLabels = ["$0k", "$3k", "$8k", "$15k", "$30k", "$60k"];

    boundaries.forEach((b, i) => {
      const x = i * barWidth; // each boundary is at a bar edge
      // tick line
      g.append("line")
        .attr("x1", x).attr("x2", x)
        .attr("y1", barHeight).attr("y2", barHeight + 6)
        .attr("stroke", "#888");
      // tick label
      g.append("text")
        .attr("x", x)
        .attr("y", barHeight + 18)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#444")
        .text(boundaryLabels[i]);
    });

    // GNI dot — positioned using the segment-aware scale
    const gniX = gniToX(Math.min(gni, 60000));

    g.append("circle")
      .attr("cx", gniX)
      .attr("cy", -5)
      .attr("r", 5)
      .attr("fill", "black");

    g.append("text")
      .attr("x", gniX)
      .attr("y", -18)
      .attr("text-anchor", "middle")
      .attr("fill", "#222")
      .style("font-weight", "600")
      .style("font-size", "13px")
      .text(`$${gni.toFixed(0)} (PPP)`);

    d3.select(stackRef.current).append("p").text(description);


    d3.select(stackRef.current)
      .append("p")
      .text("* Income categories are approximations based on global income distribution patterns and poverty research, not official World Bank classifications. Figures are in PPP-adjusted USD.")
      .style("font-size", "11px")
      .style("color", "#aaa")
      .style("font-style", "italic")
      .style("margin-top", "16px")
      .style("border-top", "1px solid #e0e0e0")
       .style("padding-top", "10px");  
}, [countryData]);
  

  return <div ref={stackRef}></div>;
}