// data/countries.ts

export const COUNTRY_DATA = [
  { name: "United States", lat: 37.0902, lng: -95.7129, cat: "High Income", mortality: 0.64, gni: 71767, edu: 99.2, life: 77.9 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, cat: "High Income", mortality: 0.36, gni: 64645, edu: 100.9, life: 81.0 },
  { name: "Japan", lat: 36.2048, lng: 138.2529, cat: "High Income", mortality: 0.23, gni: 46472, edu: 102.2, life: 84.4 },
  { name: "Canada", lat: 56.1304, lng: -106.3468, cat: "High Income", mortality: 0.50, gni: 56471, edu: 110.4, life: 82.0 },
  { name: "Australia", lat: -25.2744, lng: 133.7751, cat: "High Income", mortality: 0.36, gni: 57557, edu: 101.1, life: 83.4 },
  { name: "China", lat: 35.8617, lng: 104.1954, cat: "Upper Middle Income", mortality: 0.61, gni: 20701, edu: 92.3, life: 78.1 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, cat: "Upper Middle Income", mortality: 1.44, gni: 17512, edu: 104.0, life: 74.6 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, cat: "Upper Middle Income", mortality: 1.24, gni: 20246, edu: 102.5, life: 72.9 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, cat: "Upper Middle Income", mortality: 3.46, gni: 13421, edu: 104.2, life: 64.5 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, cat: "Upper Middle Income", mortality: 1.28, gni: 31697, edu: 111.9, life: 76.8 },
  { name: "India", lat: 20.5937, lng: 78.9629, cat: "Lower Middle Income", mortality: 2.77, gni: 7955, edu: 77.3, life: 70.3 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, cat: "Lower Middle Income", mortality: 2.00, gni: 11432, edu: 92.2, life: 74.4 },
  { name: "Zimbabwe", lat: -19.0154, lng: 29.1549, cat: "Lower Middle Income", mortality: 4.42, gni: 4752, edu: 52.4, life: 61.8 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, cat: "Lower Middle Income", mortality: 1.75, gni: 15124, edu: 79.0, life: 70.5 },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, cat: "Lower Middle Income", mortality: 3.05, gni: 7833, edu: 64.7, life: 73.3 },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, cat: "Low Income", mortality: 4.64, gni: 2575, edu: 33.9, life: 66.5 },
  { name: "Afghanistan", lat: 33.9391, lng: 67.7100, cat: "Low Income", mortality: 5.55, gni: 2157, edu: 54.9, life: 64.0 },
  { name: "Niger", lat: 17.6078, lng: 8.0817, cat: "Low Income", mortality: 11.47, gni: 1615, edu: 21.9, life: 60.4 },
  { name: "Chad", lat: 15.4542, lng: 18.7322, cat: "Low Income", mortality: 10.11, gni: 2410, edu: 21.8, life: 54.2 },
  { name: "Somalia", lat: 5.1521, lng: 46.1996, cat: "Low Income", mortality: 10.40, gni: 1387, edu: 4.4, life: 56.2 }
];

export const COUNTRIES = COUNTRY_DATA.map((c, i) => ({
  ...c,
  color: `hsl(${(i * 360) / 20}, 75%, 55%)`,
}));