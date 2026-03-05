import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface Props {
  countryData: any;
}

export default function Chapter4Chart({ countryData }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [yearsLived, setYearsLived] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const targetLife = countryData.life || 65; 
  const countryName = countryData.name || "Selected Country";

  const handleClaimTime = () => {
    setIsCounting(true);
    let start = 0;
    const duration = 2000;
    const increment = targetLife / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetLife) {
        setYearsLived(targetLife);
        setCompleted(true);
        setIsCounting(false);
        clearInterval(timer);
      } else {
        setYearsLived(start);
      }
    }, 16);
  };

  useEffect(() => {
    if (!completed || !chartRef.current) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 450 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("svg").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 450 250`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const data = Array.from({ length: 24 }, (_, i) => ({
      year: 2000 + i,
      value: targetLife - (5 - i * 0.2)
    }));

    const x = d3.scaleLinear().domain([2000, 2023]).range([0, width]);
    const y = d3.scaleLinear().domain([40, 90]).range([height, 0]);

    // Draw Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))
      .attr("color", "#444");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#444");

    // Line Generator
    const line = d3.line<any>()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Draw the path with animation
    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", countryData.color)
      .attr("stroke-width", 3)
      .attr("d", line);

    const totalLength = (path.node() as SVGPathElement).getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0);

    // Label for the country
    svg.append("text")
      .attr("x", width)
      .attr("y", y(targetLife) - 10)
      .attr("text-anchor", "end")
      .style("fill", countryData.color)
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text(countryName);

  }, [completed, countryData, targetLife]);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', margin: 0 }}>
          {yearsLived.toFixed(1)} <span style={{ fontSize: '16px', color: countryData.color }}>Years</span>
        </h3>
        <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Statistical Life Expectancy
        </p>
      </div>

      {!completed ? (
        <button 
          onClick={handleClaimTime}
          disabled={isCounting}
          style={{
            padding: '16px 40px', borderRadius: '100px',
            background: isCounting ? '#111' : countryData.color,
            color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {isCounting ? 'CALCULATING BIOLOGY...' : 'CLAIM YOUR TIME'}
        </button>
      ) : (
        <div ref={chartRef} style={{ animation: 'fadeIn 1s ease-out' }} />
      )}

      {completed && (
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
          Your journey in {countryName} concludes here. 
          {targetLife > 75 ? " A long life facilitated by systemic stability." : " A timeline truncated by environmental and economic hurdles."}
        </p>
      )}
    </div>
  );
}