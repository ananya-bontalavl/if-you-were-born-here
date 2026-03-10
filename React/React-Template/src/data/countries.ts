// data/countries.ts

export const COUNTRY_DATA = [
<<<<<<< HEAD
  { name: "United States", lat: 37.0902, lng: -95.7129, cat: "High Income", mortality: 0.73, gni: 54030.8, edu: 16.26, life: 78.07 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, cat: "High Income", mortality: 0.43, gni: 46008.75, edu: 16.85, life: 80.07 },
  { name: "Japan", lat: 36.2048, lng: 138.2529, cat: "High Income", mortality: 0.32, gni: 38513.33, edu: 15.29, life: 83.15 },
  { name: "Canada", lat: 56.1304, lng: -106.3468, cat: "High Income", mortality: 0.56, gni: 42533.3, edu: 15.65, life: 81.12 },
  { name: "Australia", lat: -25.2744, lng: 133.7751, cat: "High Income", mortality: 0.47, gni: 42075.42, edu: 21.76, life: 81.98 },
  { name: "China", lat: 35.8617, lng: 104.1954, cat: "Upper Middle Income", mortality: 1.67, gni: 11311.6, edu: 13.10, life: 75.78 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, cat: "Upper Middle Income", mortality: 1.44, gni: 13705, edu: 15.16, life: 73.44 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, cat: "Upper Middle Income", mortality: 2.02, gni: 16798.7, edu: 13.63, life: 73.56 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, cat: "Upper Middle Income", mortality: 5.29, gni: 11887.92, edu: 13.11, life: 60.31 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, cat: "Upper Middle Income", mortality: 1.9, gni: 20867.5, edu: 15.45, life: 75.16 },
  { name: "India", lat: 20.5937, lng: 78.9629, cat: "Lower Middle Income", mortality: 5.57, gni: 4878.7, edu: 11.16, life: 67.45 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, cat: "Lower Middle Income", mortality: 2.34, gni: 6729.58, edu: 13.08, life: 73.74 },
  { name: "Zimbabwe", lat: -19.0154, lng: 29.1549, cat: "Lower Middle Income", mortality: 7.3, gni: 3586.67, edu: 10.77, life: 53.8 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, cat: "Lower Middle Income", mortality: 2.86, gni: 9856.6, edu: 11.66, life: 69.35 },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, cat: "Lower Middle Income", mortality: 4.95, gni: 4105.4, edu: 9.93, life: 68.53 },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, cat: "Low Income", mortality: 8.32, gni: 1375, edu: 7.60, life: 59.99 },
  { name: "Afghanistan", lat: 33.9391, lng: 67.7100, cat: "Low Income", mortality: 8.74, gni: 1741.67, edu: 9.14, life: 60.49 },
  { name: "Niger", lat: 17.6078, lng: 8.0817, cat: "Low Income", mortality: 14.8, gni: 1177.92, edu: 5.27, life: 56.53 },
  { name: "Chad", lat: 15.4542, lng: 18.7322, cat: "Low Income", mortality: 14.23, gni: 1984.58, edu: 6.95, life: 50.73 },
  { name: "Somalia", lat: 5.1521, lng: 46.1996, cat: "Low Income", mortality: 16.07, gni: 1005.42, edu: 7.49, life: 52.05 }
=======
  { name: "United States", lat: 37.0902, lng: -95.7129, cat: "High Income", mortality: 0.73, gni: 54030.8, edu: 99.23, schooling: 16.26, life: 78.07 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, cat: "High Income", mortality: 0.43, gni: 46008.75, edu: 100.94, schooling: 16.85, life: 80.07 },
  { name: "Japan", lat: 36.2048, lng: 138.2529, cat: "High Income", mortality: 0.32, gni: 38513.33, edu: 102.21, schooling: 15.29, life: 83.15 },
  { name: "Canada", lat: 56.1304, lng: -106.3468, cat: "High Income", mortality: 0.56, gni: 42533.3, edu: 110.44, schooling: 15.65, life: 81.12 },
  { name: "Australia", lat: -25.2744, lng: 133.7751, cat: "High Income", mortality: 0.47, gni: 42075.42, edu: 101.13, schooling: 21.76, life: 81.98 },
  { name: "China", lat: 35.8617, lng: 104.1954, cat: "Upper Middle Income", mortality: 1.67, gni: 11311.6, edu: 92.26, schooling: 13.10, life: 75.78 },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, cat: "Upper Middle Income", mortality: 1.44, gni: 13705, edu: 104.03, schooling: 15.16, life: 73.44 },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, cat: "Upper Middle Income", mortality: 2.02, gni: 16798.7, edu: 102.46, schooling: 13.63, life: 73.56 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, cat: "Upper Middle Income", mortality: 5.29, gni: 11887.92, edu: 104.22, schooling: 13.11, life: 60.31 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, cat: "Upper Middle Income", mortality: 1.9, gni: 20867.5, edu: 111.93, schooling: 15.45, life: 75.16 },
  { name: "India", lat: 20.5937, lng: 78.9629, cat: "Lower Middle Income", mortality: 5.57, gni: 4878.7, edu: 77.25, schooling: 11.16, life: 67.45 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, cat: "Lower Middle Income", mortality: 2.34, gni: 6729.58, edu: 92.19, schooling: 13.08, life: 73.74 },
  { name: "Zimbabwe", lat: -19.0154, lng: 29.1549, cat: "Lower Middle Income", mortality: 7.3, gni: 3586.67, edu: 52.41, schooling: 10.77, life: 53.8 },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, cat: "Lower Middle Income", mortality: 2.86, gni: 9856.6, edu: 79.01, schooling: 11.66, life: 69.35 },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, cat: "Lower Middle Income", mortality: 4.95, gni: 4105.4, edu: 64.73, schooling: 9.93, life: 68.53 },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, cat: "Low Income", mortality: 8.32, gni: 1375, edu: 33.91, schooling: 7.60, life: 59.99 },
  { name: "Afghanistan", lat: 33.9391, lng: 67.7100, cat: "Low Income", mortality: 8.74, gni: 1741.67, edu: 54.8699, schooling: 9.14, life: 60.49 },
  { name: "Niger", lat: 17.6078, lng: 8.0817, cat: "Low Income", mortality: 14.8, gni: 1177.92, edu: 21.921, schooling: 5.27, life: 56.53 },
  { name: "Chad", lat: 15.4542, lng: 18.7322, cat: "Low Income", mortality: 14.23, gni: 1984.58, edu: 21.8435, schooling: 6.95, life: 50.73 },
  { name: "Somalia", lat: 5.1521, lng: 46.1996, cat: "Low Income", mortality: 16.07, gni: 1005.42, edu: 4.3607, schooling: 7.49, life: 52.05 }
>>>>>>> 3d02cb8 (changes to parallel plot and summary table)
];

const BASE_COLORS: Record<string, string> = {
  "High Income": "#36BBA7",
  "Upper Middle Income": "#1e90ff",
  "Lower Middle Income": "#FF692A",
  "Low Income": "#ff3f81"
};

function hexToHSL(H: string) {
  let r = 0, g = 0, b = 0;
  if (H.length === 7) {
    r = parseInt(H.substring(1, 3), 16) / 255;
    g = parseInt(H.substring(3, 5), 16) / 255;
    b = parseInt(H.substring(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max != min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToString(h: number, s: number, l: number) {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateQuadrantColors(countries: any[], baseColor: string) {
  const hsl = hexToHSL(baseColor);
  return countries.map((c, i) => {
    const step = (i / (countries.length - 1)) * 20;
    const l = Math.min(100, hsl.l + step);
    return { ...c, color: hslToString(hsl.h, hsl.s, l) };
  });
}

function groupByIncome(data: any[]) {
  const map: Record<string, any[]> = {};
  data.forEach(c => {
    if (!map[c.cat]) map[c.cat] = [];
    map[c.cat].push(c);
  });
  return map;
}

const grouped = groupByIncome(COUNTRY_DATA);
export const COUNTRIES = [
  ...generateQuadrantColors(grouped["High Income"], BASE_COLORS["High Income"]),
  ...generateQuadrantColors(grouped["Upper Middle Income"], BASE_COLORS["Upper Middle Income"]),
  ...generateQuadrantColors(grouped["Lower Middle Income"], BASE_COLORS["Lower Middle Income"]),
  ...generateQuadrantColors(grouped["Low Income"], BASE_COLORS["Low Income"])
];