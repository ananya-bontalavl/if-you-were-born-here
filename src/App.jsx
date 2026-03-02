import React, { useState, useEffect } from "react";
import * as d3 from "d3";

import Chapter1Chart from "./charts/Chapter1Chart.jsx";
import Chapter2Chart from "./charts/Chapter2Chart.jsx";
import Chapter3Chart from "./charts/Chapter3Chart.jsx";
import Chapter4Chart from "./charts/Chapter4Chart.jsx";

export default function App() {
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    d3.csv("/data/countries.csv").then((data) => {
      const parsed = data.map(d => ({
        ...d,
        "Child Mortality(per 100)(2023)": +d["Child Mortality(per 100)(2023)"],
        "Years of Schooling(2000-2023)": +d["Years of Schooling(2000-2023)"],
        "GNI adjusted with PPP(2000-2023)": +d["GNI adjusted with PPP(2000-2023)"]
      }));

      setCountriesData(parsed);
      setSelectedCountry(parsed[0]);
    });
  }, []);

  if (!selectedCountry) return <p>Loading data...</p>;

  return (
    <div className="App">

      <h1>If You Were Born Here…</h1>

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

      <div className="chapter">
        <h2>Chapter 1 – Childhood</h2>
        <Chapter1Chart countryData={selectedCountry} />
      </div>

      <div className="chapter">
        <h2>Chapter 2 – Education</h2>
        <Chapter2Chart
          countryData={selectedCountry}
          countriesData={countriesData}
        />
      </div>

      <div className="chapter">
        <h2>Chapter 3 – Adult Life (Income)</h2>
        <Chapter3Chart
          countryData={selectedCountry}
          countriesData={countriesData}
        />
      </div>
      <div className="chapter">
        <h2>Chapter 4 – Old Age (Life Expectancy)</h2>
        <Chapter4Chart selectedCountry={selectedCountry.Country} />
      </div>

    </div>
  );
}