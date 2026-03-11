import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { COUNTRIES } from "../data/countries";

interface Props {
  selectedCountry: any;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  country: any;
}

export default function ParallelPlot({ selectedCountry }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [traced, setTraced] = useState(false);
  const [showGlobal, setShowGlobal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, country: null });

  const categories = ["all", "High Income", "Upper Middle Income", "Lower Middle Income", "Low Income"];

  const categoryColors: Record<string, string> = {
    "High Income": "#5C9E7A",
    "Upper Middle Income": "#6F7FB2",
    "Lower Middle Income": "#B89B6B",
    "Low Income": "#A56B6B",
  };

  // Summary stats per category — now uses `schooling` field
  const categoryStats = Object.entries(categoryColors).map(([cat, color]) => {
    const group = COUNTRIES.filter(c => c.cat === cat);
    if (!group.length) return null;
    const avg = (key: string) => (group.reduce((s, c) => s + (c[key] || 0), 0) / group.length).toFixed(1);
    return {
      cat, color,
      mortality: avg("mortality"),
      schooling: avg("schooling"),
      gni: Math.round(group.reduce((s, c) => s + (c.gni || 0), 0) / group.length).toLocaleString(),
      life: avg("life")
    };
  }).filter(Boolean);

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
      { key: "mortality",  label: "Mortality",  domain: [12, 0] as [number, number] },
      { key: "schooling",  label: "Schooling",  domain: [0, 22] as [number, number] },
      { key: "gni",        label: "Income",     domain: [0, 80000] as [number, number] },
      { key: "life",       label: "Longevity",  domain: [45, 90] as [number, number] },
    ];

    const x = d3.scalePoint().range([0, innerWidth]).domain(dimensions.map(d => d.label));

    const yScales: Record<string, d3.ScaleLinear<number, number>> = {};
    dimensions.forEach(d => {
      yScales[d.label] = d3.scaleLinear().domain(d.domain).range([innerHeight, 0]).clamp(true);
    });

    const lineGenerator = d3.line<any>().x(d => d.x).y(d => d.y).curve(d3.curveLinear);
    const getPathData = (d: any) => dimensions.map(dim => ({
      x: x(dim.label) as number,
      y: yScales[dim.label](d[dim.key] || 0)
    }));

    // Axes
    dimensions.forEach(dim => {
      const axisG = g.append("g").attr("transform", `translate(${x(dim.label)}, 0)`);
      axisG.append("line").attr("y1", 0).attr("y2", innerHeight).attr("stroke", "rgba(255,255,255,0.15)");
      axisG.call(d3.axisLeft(yScales[dim.label]).ticks(5).tickSize(-5)).attr("color", "rgba(255,255,255,0.8)");

      // Append "yr" suffix to Schooling tick labels
      if (dim.label === "Schooling") {
        axisG.selectAll<SVGTextElement, unknown>(".tick text").each(function () {
          const el = d3.select(this);
          el.text(el.text() + " yr");
        });
      }

      axisG.append("text")
        .attr("y", -25).attr("text-anchor", "middle")
        .style("fill", "#aaa").style("font-size", "10px")
        .style("font-weight", "900").style("text-transform", "uppercase")
        .text(dim.label);
    });

    // Global lines with animated intro
    if (showGlobal) {
      const filteredGlobal = COUNTRIES.filter(d => {
        const isSelected = d.name === selectedCountry.name;
        const categoryMatch = selectedCategory === "all" || d.cat === selectedCategory;
        return !isSelected && categoryMatch;
      });

      filteredGlobal.forEach((d, i) => {
        const pathEl = g.append("path")
          .attr("class", "global-path")
          .attr("d", lineGenerator(getPathData(d)))
          .attr("fill", "none")
          .attr("stroke", categoryColors[d.cat] || "#888888")
          .attr("stroke-width", 1.8)
          .attr("opacity", 0)
          .style("cursor", "pointer");

        const pathNode = pathEl.node() as SVGPathElement;
        const len = pathNode.getTotalLength();
        pathEl
          .attr("stroke-dasharray", `${len} ${len}`)
          .attr("stroke-dashoffset", len)
          .transition()
          .delay(i * 60)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("stroke-dashoffset", 0)
          .attr("opacity", 0.6);

        pathEl
          .on("mouseenter", function (event) {
            d3.select(this).attr("opacity", 1).attr("stroke-width", 4);
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (!rect) return;
            setTooltip({
              visible: true,
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              country: d
            });
          })
          .on("mousemove", function (event) {
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (!rect) return;
            setTooltip(prev => ({ ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top }));
          })
          .on("mouseleave", function () {
            d3.select(this).attr("opacity", 0.6).attr("stroke-width", 2.5);
            setTooltip(prev => ({ ...prev, visible: false }));
          });
      });
    }

    // Selected country line on top
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
      path
        .attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition().duration(2000).ease(d3.easeCubicInOut)
        .attr("stroke-dashoffset", 0);

      g.append("text")
        .attr("x", innerWidth + 15)
        .attr("y", yScales["Longevity"](selectedCountry.life))
        .attr("alignment-baseline", "middle")
        .style("fill", selectedCountry.color).style("font-weight", "900").style("font-size", "14px")
        .text(selectedCountry.name)
        .style("opacity", 0).transition().delay(1800).style("opacity", 1);
    }
  }, [selectedCountry, traced, showGlobal, selectedCategory]);

  const handleTrace = () => {
    setTraced(true);
    setTimeout(() => setShowGlobal(true), 3000);
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', textAlign: 'center', position: 'relative' }}>

      {/* Category filter buttons */}
      {showGlobal && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontSize: '9px', padding: '6px 14px', borderRadius: '20px',
                border: `1px solid ${selectedCategory === cat ? (categoryColors[cat] || '#fff') : '#333'}`,
                background: selectedCategory === cat ? (categoryColors[cat] ? `${categoryColors[cat]}22` : '#fff') : 'transparent',
                color: selectedCategory === cat ? (categoryColors[cat] || '#000') : '#888',
                cursor: 'pointer', textTransform: 'uppercase', fontWeight: 900, transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* SVG Chart */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '50px 20px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <svg ref={svgRef} viewBox="0 0 800 450" width="100%" height="auto" style={{ overflow: 'visible' }} />
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.country && (
        <div style={{
          position: 'absolute',
          left: tooltip.x + 16,
          top: tooltip.y - 10,
          background: 'rgba(10,10,15,0.95)',
          border: `1px solid ${categoryColors[tooltip.country.cat] || '#444'}`,
          borderRadius: '16px',
          padding: '14px 18px',
          pointerEvents: 'none',
          zIndex: 100,
          textAlign: 'left',
          minWidth: '180px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.6)`
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '14px', color: categoryColors[tooltip.country.cat] || '#fff' }}>
            {tooltip.country.name}
          </p>
          <p style={{ margin: '2px 0', fontSize: '11px', color: '#888' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>{tooltip.country.mortality}</span> mortality/100
          </p>
          <p style={{ margin: '2px 0', fontSize: '11px', color: '#888' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>{tooltip.country.schooling} yrs</span> schooling
          </p>
          <p style={{ margin: '2px 0', fontSize: '11px', color: '#888' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>${tooltip.country.gni?.toLocaleString()}</span> GNI
          </p>
          <p style={{ margin: '2px 0', fontSize: '11px', color: '#888' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>{tooltip.country.life} yrs</span> life expectancy
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: categoryColors[tooltip.country.cat] || '#666' }}>
            {tooltip.country.cat}
          </p>
        </div>
      )}

      {/* Summary Stats Panel */}
      {showGlobal && (
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {categoryStats.map(stat => stat && (
            <div key={stat.cat} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
              border: `1px solid ${stat.color}33`, padding: '16px 12px', textAlign: 'center'
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: stat.color }}>
                {stat.cat}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Mortality',  val: `${stat.mortality}/100` },
                  { label: 'Schooling',  val: `${stat.schooling} yrs` },
                  { label: 'GNI',        val: `$${stat.gni}` },
                  { label: 'Life Exp.',  val: `${stat.life} yrs` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase' }}>{label}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#ccc' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA / status */}
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
          {showGlobal ? "Average Global Context Revealed" : "Analyzing trajectories..."}
        </p>
      )}
    </div>
  );
}