import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { COUNTRIES } from "../data/countries"; 

interface Props {
  selectedCountry: any;
}

export default function ParallelPlot({ selectedCountry }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [traced, setTraced] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!svgRef.current || !selectedCountry) return;

    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 120, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const dimensions = [
      { key: "mortality", label: "Mortality", domain: [12, 0] },
      { key: "edu", label: "Education", domain: [0, 120] },
      { key: "gni", label: "Income", domain: [0, 80000] },
      { key: "life", label: "Longevity", domain: [45, 90] }
    ];

    const x = d3.scalePoint().range([0, innerWidth]).domain(dimensions.map(d => d.label));
    
    const yScales: any = {};
    dimensions.forEach(d => {
      yScales[d.label] = d3.scaleLinear()
        .domain(d.domain)
        .range([innerHeight, 0])
        .clamp(true);
    });

    const lineGenerator = d3.line<any>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveLinear);

    const getPathData = (d: any) => dimensions.map(dim => ({
      x: x(dim.label),
      y: yScales[dim.label](d[dim.key] || 0)
    }));

    dimensions.forEach(dim => {
      const axisG = g.append("g").attr("transform", `translate(${x(dim.label)}, 0)`);
      
      axisG.append("line")
        .attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", "rgba(255,255,255,0.15)");

      axisG.call(d3.axisLeft(yScales[dim.label]).ticks(5).tickSize(-5))
        .attr("color", "rgba(255,255,255,0.3)");

      axisG.append("text")
        .attr("y", -25)
        .attr("text-anchor", "middle")
        .style("fill", "#aaa")
        .style("font-size", "10px")
        .style("font-weight", "900")
        .style("text-transform", "uppercase")
        .text(dim.label);
    });

    if (showGlobal) {
      const filteredGlobal = COUNTRIES.filter(d => {
        const isSelected = d.name === selectedCountry.name;
        const categoryMatch = selectedCategory === "all" || d.cat === selectedCategory;
        return !isSelected && categoryMatch;
      });

      g.selectAll(".global-path")
        .data(filteredGlobal)
        .enter()
        .append("path")
        .attr("class", "global-path")
        .attr("d", d => lineGenerator(getPathData(d)))
        .attr("fill", "none")
        .attr("stroke", d => {
          if (d.cat === "High Income") return "#5C9E7A";          
          if (d.cat === "Upper Middle Income") return "#6F7FB2"; 
          if (d.cat === "Lower Middle Income") return "#B89B6B"; 
          if (d.cat === "Low Income") return "#A56B6B";          
          return "#888888";
        })
        .attr("stroke-width", 2.5)       // ← was 1
        .attr("opacity", 0)
        .transition()
        .duration(1000)
        .attr("opacity", 0.6);           // ← was 0.19
    }

    if (traced) {
      const path = g.append("path")
        .datum(getPathData(selectedCountry))
        .attr("fill", "none")
        .attr("stroke", selectedCountry.color)
        .attr("stroke-width", 5)
        .attr("stroke-linecap", "round")
        .attr("d", lineGenerator)
        .style("filter", `drop-shadow(0 0 10px ${selectedCountry.color})`);

      const length = (path.node() as SVGPathElement).getTotalLength();
      path.attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .duration(2000)
        .ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);

      g.append("text")
        .attr("x", innerWidth + 15)
        .attr("y", yScales["Longevity"](selectedCountry.life))
        .attr("alignment-baseline", "middle")
        .style("fill", selectedCountry.color)
        .style("font-weight", "900")
        .style("font-size", "14px")
        .text(selectedCountry.name)
        .style("opacity", 0)
        .transition().delay(1800).style("opacity", 1);
    }
  }, [selectedCountry, traced, showGlobal, selectedCategory]);

  const handleTrace = () => {
    setTraced(true);
    setTimeout(() => {
      setShowGlobal(true);
    }, 3000); 
  };

  const categories = ["all", "High Income", "Upper Middle Income", "Lower Middle Income", "Low Income"];

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {showGlobal && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '9px', padding: '6px 14px', borderRadius: '20px', 
                border: `1px solid ${selectedCategory === cat ? '#fff' : '#333'}`,
                background: selectedCategory === cat ? '#fff' : 'transparent',
                color: selectedCategory === cat ? '#000' : '#888',
                cursor: 'pointer', textTransform: 'uppercase', fontWeight: 900,
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '50px 20px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <svg ref={svgRef} viewBox="0 0 800 450" width="100%" height="auto" style={{ overflow: 'visible' }} />
      </div>

      {!traced ? (
        <button 
          onClick={handleTrace} 
          style={{ 
            marginTop: '30px', padding: '16px 40px', borderRadius: '100px', 
            background: selectedCountry.color, color: '#000', border: 'none', 
            fontWeight: 900, cursor: 'pointer', fontSize: '12px' 
          }}
        >
          TRACE MY FINAL FATE
        </button>
      ) : (
        <p style={{ marginTop: '20px', color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          {showGlobal ? "Global Context Revealed" : "Analyzing trajectories..."}
        </p>
      )}
    </div>
  );
}