import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function Chapter4Chart2({ selectedCountry }) {
  const ref = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 60, right: 120, bottom: 70, left: 80 },
      width = 700 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select(ref.current)
      .append("div")
      .attr("ref", tooltipRef)
      .style("position","absolute")
      .style("background","white")
      .style("border","1px solid #ccc")
      .style("padding","8px 12px")
      .style("border-radius","6px")
      .style("font-size","13px")
      .style("pointer-events","none")
      .style("opacity",0);

    d3.csv("/data/female-male-life-expectancy.csv", d3.autoType).then(data => {

      const filtered = data.filter(
        d => d.Country === selectedCountry && d.Year >= 2000 && d.Year <= 2023
      );

      if (!filtered.length) return;

      const x = d3.scaleLinear()
        .domain(d3.extent(filtered, d => d.Year))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([
          d3.min(filtered, d => Math.min(d.Men, d.Women)) - 2,
          d3.max(filtered, d => Math.max(d.Men, d.Women)) + 2
        ])
        .range([height, 0]);

      g.append("g")
        .attr("transform",`translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      g.append("g")
        .call(d3.axisLeft(y));

      const menColor = "#4e79a7";
      const womenColor = "#e15759";

      const menLine = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Men));

      const womenLine = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Women));

      g.append("path")
        .datum(filtered)
        .attr("fill","none")
        .attr("stroke",menColor)
        .attr("stroke-width",3)
        .attr("d",menLine);

      g.append("path")
        .datum(filtered)
        .attr("fill","none")
        .attr("stroke",womenColor)
        .attr("stroke-width",3)
        .attr("d",womenLine);

      // TITLE
      g.append("text")
        .attr("x", width/2)
        .attr("y",-20)
        .attr("text-anchor","middle")
        .style("font-size","18px")
        .style("font-weight","bold")
        .text(`${selectedCountry}: Life Expectancy by Gender`);

      // AXIS LABELS
      g.append("text")
        .attr("x", width/2)
        .attr("y", height+45)
        .attr("text-anchor","middle")
        .text("Year");

      g.append("text")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",-55)
        .attr("text-anchor","middle")
        .text("Life expectancy (years)");

      // LEGEND
      const legend = g.append("g")
        .attr("transform", `translate(${width+20},20)`);

      legend.append("circle").attr("r",6).attr("fill",menColor);
      legend.append("text").attr("x",12).attr("y",4).text("Men");

      legend.append("circle").attr("cy",25).attr("r",6).attr("fill",womenColor);
      legend.append("text").attr("x",12).attr("y",29).text("Women");

      // TOOLTIP SYSTEM (same style as your other chart)

      const bisectYear = d3.bisector(d => d.Year).left;

      const focusLine = g.append("line")
        .attr("stroke","#aaa")
        .attr("y1",0)
        .attr("y2",height)
        .style("opacity",0);

      const overlay = g.append("rect")
        .attr("width",width)
        .attr("height",height)
        .attr("fill","none")
        .attr("pointer-events","all");

      overlay
        .on("mousemove",(event)=>{

          const [mx] = d3.pointer(event);
          const year = Math.round(x.invert(mx));

          focusLine
            .attr("x1",x(year))
            .attr("x2",x(year))
            .style("opacity",1);

          const i = bisectYear(filtered, year);
          const d0 = filtered[i-1];
          const d1 = filtered[i];
          const d = !d0 ? d1 : !d1 ? d0 : year - d0.Year > d1.Year - year ? d1 : d0;

          tooltip
            .style("opacity",1)
            .html(`
              <strong>${d.Year}</strong><br/>
              <span style="color:${menColor}">●</span> Men: ${d.Men.toFixed(1)}<br/>
              <span style="color:${womenColor}">●</span> Women: ${d.Women.toFixed(1)}
            `)
            .style("left", event.offsetX + 20 + "px")
            .style("top", event.offsetY - 30 + "px");

        })
        .on("mouseout",()=>{
          tooltip.style("opacity",0);
          focusLine.style("opacity",0);
        });

    });

  }, [selectedCountry]);

  return <div style={{position:"relative"}} ref={ref}></div>;
}