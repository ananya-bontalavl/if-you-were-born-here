import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface Props {
  // We expect the 'winner' object from SimulatorSection
  countryData: {
    name: string;
    mortality?: number;
    color?: string;
    [key: string]: any; 
  };
}

export default function Chapter1Chart({ countryData }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!svgRef.current || !countryData) return;

    // Grab mortality. If it's missing, default to 5.0 so the chart doesn't crash
    const mortality = Number(countryData.mortality) || 5.0;
    
    const fullFaded = Math.floor(mortality);
    const partial = mortality - fullFaded;

    const cols = 10;
    const iconSize = 25;
    const gap = 6;

    const svg = d3.select(svgRef.current);
    
    // Clear previous renders
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", "translate(20,20)");

    const icons = g.selectAll(".icon")
      .data(d3.range(100))
      .enter()
      .append("g")
      .attr("class", "icon")
      .attr("transform", (d, i) => {
        const x = (i % cols) * (iconSize + gap);
        const y = Math.floor(i / cols) * (iconSize + gap);
        return `translate(${x},${y})`;
      });

    // base = survivor (Green)
    icons.append("rect")
      .attr("width", iconSize)
      .attr("height", iconSize)
      .attr("rx", 4)
      .attr("fill", "#4caf50");

    // overlay = mortality (Red)
    const overlay = icons.append("rect")
      .attr("width", (d, i) => i < fullFaded ? iconSize : i === fullFaded ? iconSize * partial : 0)
      .attr("height", iconSize)
      .attr("rx", 4)
      .attr("fill", "#d9534f")
      .attr("opacity", 0);

    // animate full red squares
    overlay.filter((d, i) => i < fullFaded)
      .transition().delay((d, i) => i * 40).duration(500)
      .attr("opacity", 0.95);

    // animate partial square
    if (partial > 0) {
      overlay.filter((d, i) => i === fullFaded)
        .transition().delay(fullFaded * 40).duration(500)
        .attr("opacity", 0.95);
    }

    // Update the paragraph text below
    if (textRef.current) {
      textRef.current.innerText = `Out of 100 children in ${countryData.name}, about ${mortality.toFixed(1)} do not survive past age 5.`;
    }

  }, [countryData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* By explicitly writing <svg> here, React forces the browser to reserve a 350x350 box. 
        This stops D3 from collapsing to 0 pixels!
      */}
      <svg ref={svgRef} width="350" height="350" style={{ overflow: "visible" }}></svg>
      
      <p ref={textRef} style={{ marginTop: '20px', color: '#fff', fontSize: '1.2rem', fontWeight: 600, textAlign: 'center' }}></p>
    </div>
  );
}