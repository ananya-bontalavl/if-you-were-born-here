import React, { useState, useEffect } from "react";
import Chapter1Chart from "./charts/Chapter1Chart.jsx";
import * as d3 from "d3";

export default function App() {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Load CSV on mount
  useEffect(() => {
    d3.csv("/data/countries.csv").then((data) => {
      const parsed = data.map(d => ({
        ...d,
        "Child Mortality(per 100)(2023)": +d["Child Mortality(per 100)(2023)"] // convert to number
      }));
      setCountriesData(parsed);
      setSelectedCountry(parsed[0]); // select first country by default
    });
  }, []);

  if (!selectedCountry) return <p>Loading data...</p>;

  return (
    <div className="App">
      <h2>Chapter 1 – Childhood</h2>

      {/* Dropdown */}
      <select
        value={selectedCountry.Country}
        onChange={(e) => {
          const country = countriesData.find(c => c.Country === e.target.value);
          setSelectedCountry(country);
        }}
      >
        {countriesData.map((c) => (
          <option key={c.Country} value={c.Country}>{c.Country}</option>
        ))}
      </select>

      {/* Chart */}
      <Chapter1Chart countryData={selectedCountry} />
    </div>
  );
}