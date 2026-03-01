import React, { useState, useEffect } from "react";
import * as d3 from "d3";

import Chapter1Chart from "./charts/Chapter1Chart.jsx";
import Chapter2Chart from "./charts/Chapter2Chart.jsx";

export default function App() {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Load CSV on mount
  useEffect(() => {
    d3.csv("/data/countries.csv").then((data) => {
      const parsed = data.map(d => ({
        ...d,
        "Child Mortality(per 100)(2023)": +d["Child Mortality(per 100)(2023)"],
        "Years of Schooling(2000-2023)": +d["Years of Schooling(2000-2023)"]
      }));

      setCountriesData(parsed);
      setSelectedCountry(parsed[0]); // default = first country
    });
  }, []);

  if (!selectedCountry) return <p>Loading data...</p>;

  return (
    <div className="App">
      <h2>Chapter 1 – Childhood</h2>

      {/* Country selector */}
      <select
        value={selectedCountry.Country}
        onChange={(e) => {
          const country = countriesData.find(
            c => c.Country === e.target.value
          );
          setSelectedCountry(country);
        }}
      >
        {countriesData.map((c) => (
          <option key={c.Country} value={c.Country}>
            {c.Country}
          </option>
        ))}
      </select>

      {/* Chapter 1 chart */}
      <Chapter1Chart countryData={selectedCountry} />

      <h2>Chapter 2 – Education</h2>

      {/* Chapter 2 ladder + ranking */}
      <Chapter2Chart
        countryData={selectedCountry}
        countriesData={countriesData}
      />
    </div>
  );
}