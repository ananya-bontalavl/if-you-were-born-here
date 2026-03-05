// data/countries.ts

export const COUNTRY_DATA = [
  { name: "United States", lat: 37.0902, lng: -95.7129, cat: "High Income", mortality: 0.73, gni: 54030.8, edu: 99.23, life: 78.07 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, cat: "High Income", mortality: 0.43, gni: 46008.75, edu: 100.94, life: 80.07 },
  { name: "Japan", lat: 36.2048, lng: 138.2529, cat: "High Income", mortality: 0.32, gni: 38513.33, edu: 102.21, life: 83.15 },
  { name: "Canada", lat: 56.1304, lng: -106.3468, cat: "High Income", mortality: 0.56, gni: 42533.3, edu: 110.44, life: 81.12 },
  { name: "Australia", lat: -25.2744, lng: 133.7751, cat: "High Income", mortality: 0.47, gni: 42075.42, edu: 101.13, life: 81.98 },
  { name: "China", lat: 35.8617, lng: 104.1954, cat: "Upper Middle Income", mortality: 1.67, gni: 11311.6, edu: 92.26, life: 75.78 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, cat: "Upper Middle Income", mortality: 1.44, gni: 13705, edu: 104.03, life: 73.44 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, cat: "Upper Middle Income", mortality: 2.02, gni: 16798.7, edu: 102.46, life: 73.56 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, cat: "Upper Middle Income", mortality: 5.29, gni: 11887.92, edu: 104.22, life: 60.31 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, cat: "Upper Middle Income", mortality: 1.9, gni: 20867.5, edu: 111.93, life: 75.16 },
  { name: "India", lat: 20.5937, lng: 78.9629, cat: "Lower Middle Income", mortality: 5.57, gni: 4878.7, edu: 77.25, life: 67.45 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, cat: "Lower Middle Income", mortality: 2.34, gni: 6729.58, edu: 92.19, life: 73.74 },
  { name: "Zimbabwe", lat: -19.0154, lng: 29.1549, cat: "Lower Middle Income", mortality: 7.3, gni: 3586.67, edu: 52.41, life: 53.8 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, cat: "Lower Middle Income", mortality: 2.86, gni: 9856.6, edu: 79.01, life: 69.35 },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, cat: "Lower Middle Income", mortality: 4.95, gni: 4105.4, edu: 64.73, life: 68.53 },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, cat: "Low Income", mortality: 8.32, gni: 1375, edu: 33.91, life: 59.99 },
  { name: "Afghanistan", lat: 33.9391, lng: 67.7100, cat: "Low Income", mortality: 8.74, gni: 1741.67, edu: 54.8699, life: 60.49 },
  { name: "Niger", lat: 17.6078, lng: 8.0817, cat: "Low Income", mortality: 14.8, gni: 1177.92, edu: 21.921, life: 56.53 },
  { name: "Chad", lat: 15.4542, lng: 18.7322, cat: "Low Income", mortality: 14.23, gni: 1984.58, edu: 21.8435, life: 50.73 },
  { name: "Somalia", lat: 5.1521, lng: 46.1996, cat: "Low Income", mortality: 16.07, gni: 1005.42, edu: 4.3607, life: 52.05 }
];

export const COUNTRIES = COUNTRY_DATA.map((c, i) => ({
  ...c,
  color: `hsl(${(i * 360) / 20}, 75%, 55%)`,
}));