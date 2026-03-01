// data/countries.ts
export const COUNTRY_DATA = [
  { name: "United States", lat: 37.0902, lng: -95.7129, mortality: 0.6 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, mortality: 0.3 },
  { name: "Japan", lat: 36.2048, lng: 138.2529, mortality: 0.2 },
  { name: "Canada", lat: 56.1304, lng: -106.3468, mortality: 0.4 },
  { name: "Australia", lat: -25.2744, lng: 133.7751, mortality: 0.3 },
  { name: "China", lat: 35.8617, lng: 104.1954, mortality: 1.1 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, mortality: 1.3 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, mortality: 1.4 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, mortality: 3.2 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, mortality: 0.9 },
  { name: "India", lat: 20.5937, lng: 78.9629, mortality: 2.5 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, mortality: 1.6 },
  { name: "Zimbabwe", lat: -19.0154, lng: 29.1549, mortality: 4.1 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, mortality: 1.8 },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, mortality: 2.2 },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, mortality: 4.8 },
  { name: "Afghanistan", lat: 33.9391, lng: 67.7100, mortality: 5.4 },
  { name: "Niger", lat: 17.6078, lng: 8.0817, mortality: 7.2 },
  { name: "Chad", lat: 15.4542, lng: 18.7322, mortality: 6.8 },
  { name: "Somalia", lat: 5.1521, lng: 46.1996, mortality: 8.4 }
];

export const COUNTRIES = COUNTRY_DATA.map((c, i) => ({
  ...c,
  color: `hsl(${(i * 360) / 20}, 75%, 55%)`,
}));