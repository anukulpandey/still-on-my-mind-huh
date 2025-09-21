import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../supabaseClient";

export default function MissesGraph() {
  const [activeTab, setActiveTab] = useState("today");

  const [todaySeries, setTodaySeries] = useState([]);
  const [todayOptions, setTodayOptions] = useState({});

  const [partsSeries, setPartsSeries] = useState([]);
  const [partsOptions, setPartsOptions] = useState({});

  const [uwuSeries, setUwuSeries] = useState([]);
  const [uwuOptions, setUwuOptions] = useState({});

  const [radarSeries, setRadarSeries] = useState([]);
  const [radarOptions, setRadarOptions] = useState({});

  const [gaugeSeries, setGaugeSeries] = useState([]);
  const [gaugeOptions, setGaugeOptions] = useState({});

  const [heatmapSeries, setHeatmapSeries] = useState([]);
  const [heatmapOptions, setHeatmapOptions] = useState({});

  useEffect(() => {
    const fetchMisses = async (code) => {
      const { data, error } = await supabase
        .from("misses")
        .select("*")
        .eq("code", code)
        .order("time", { ascending: true })
        .limit(25);

      if (error) {
        console.error(`Error fetching misses for code ${code}:`, error);
        return [];
      }
      return data;
    };

    const loadData = async () => {
      const data143 = await fetchMisses("143");
      const data1432 = await fetchMisses("1432");

      const allTimes = [
        ...data143.map((d) => ({ time: d.time, who: "Her" })),
        ...data1432.map((d) => ({ time: d.time, who: "Him" })),
      ].sort((a, b) => new Date(a.time) - new Date(b.time));

      // --- Today (cumulative line chart) ---
      let cumHer = 0;
      let cumHim = 0;
      const todayCategories = [];
      const seriesHer = [];
      const seriesHim = [];

      allTimes.forEach((entry) => {
        if (entry.who === "Her") cumHer++;
        if (entry.who === "Him") cumHim++;

        todayCategories.push(
          new Date(entry.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        seriesHer.push(cumHer);
        seriesHim.push(cumHim);
      });

      setTodaySeries([
        { name: "Her", data: seriesHer },
        { name: "Him", data: seriesHim },
      ]);
      setTodayOptions({
        chart: { id: "today", type: "line", zoom: { enabled: false }, toolbar: { show: true } },
        xaxis: {
          categories: todayCategories,
          title: { text: "Time" },
          labels: { rotate: -45, style: { fontSize: "11px" } },
          tickAmount: Math.min(todayCategories.length, 8),
        },
        yaxis: { title: { text: "Cumulative Misses" } },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#EC4899", "#3B82F6"],
        dataLabels: { enabled: false },
        grid: { borderColor: "#e5e7eb" },
      });

      // --- ByParts (bar chart per 6h) ---
      const partLabels = ["0–6h", "6–12h", "12–18h", "18–24h"];
      const partCountsHer = [0, 0, 0, 0];
      const partCountsHim = [0, 0, 0, 0];

      allTimes.forEach((entry) => {
        const hour = new Date(entry.time).getHours();
        const bucket = Math.floor(hour / 6);
        if (entry.who === "Her") partCountsHer[bucket]++;
        if (entry.who === "Him") partCountsHim[bucket]++;
      });

      setPartsSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setPartsOptions({
        chart: { id: "parts", type: "bar", toolbar: { show: true } },
        xaxis: { categories: partLabels, title: { text: "Day Parts" } },
        yaxis: { title: { text: "Misses in Part" } },
        colors: ["#EC4899", "#3B82F6"],
        plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 6 } },
        dataLabels: { enabled: true },
        grid: { borderColor: "#e5e7eb" },
      });

      // --- UwU (area chart per 6h) ---
      setUwuSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setUwuOptions({
        chart: { id: "uwu", type: "area", toolbar: { show: true } },
        xaxis: { categories: partLabels, title: { text: "Day Parts" } },
        yaxis: { title: { text: "Misses in Part" } },
        colors: ["#EC4899", "#3B82F6"],
        stroke: { curve: "smooth", width: 2 },
        dataLabels: { enabled: false },
        fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
        grid: { borderColor: "#e5e7eb" },
      });

      // --- Radar chart ---
      setRadarSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setRadarOptions({
        chart: { type: "radar", toolbar: { show: true } },
        xaxis: { categories: partLabels },
        colors: ["#EC4899", "#3B82F6"],
        stroke: { width: 2 },
        fill: { opacity: 0.3 },
      });

      // --- Gauge chart (radialBar) ---
      const totalHer = data143.length;
      const totalHim = data1432.length;
      const total = totalHer + totalHim || 1;

      const herPct = Math.round((totalHer / total) * 100);
      const himPct = Math.round((totalHim / total) * 100);

      setGaugeSeries([herPct, himPct]);
      setGaugeOptions({
        chart: { type: "radialBar" },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: { fontSize: "16px" },
              value: { fontSize: "14px", formatter: (val) => `${val}%` },
            },
          },
        },
        labels: ["Her", "Him"],
        colors: ["#EC4899", "#3B82F6"],
      });

      // --- Heatmap chart (misses per hour) ---
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const herHeat = hours.map((h) => ({
        x: `${h}:00`,
        y: data143.filter((d) => new Date(d.time).getHours() === h).length,
      }));
      const himHeat = hours.map((h) => ({
        x: `${h}:00`,
        y: data1432.filter((d) => new Date(d.time).getHours() === h).length,
      }));

      setHeatmapSeries([
        { name: "Her", data: herHeat },
        { name: "Him", data: himHeat },
      ]);
      setHeatmapOptions({
        chart: { type: "heatmap", toolbar: { show: true } },
        plotOptions: {
          heatmap: { shadeIntensity: 0.5, radius: 4, useFillColorAsStroke: true },
        },
        dataLabels: { enabled: false },
        colors: ["#EC4899", "#3B82F6"],
        xaxis: { title: { text: "Hour of Day" } },
        yaxis: { title: { text: "Misses Count" } },
      });
    };

    loadData();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <h2 className="text-center font-semibold text-lg mb-2">
        <span className="text-blue-500">{import.meta.env.VITE_CHART_TITLE}</span>
        <span className="text-pink-500"> Syndrome</span>
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {["today", "parts", "uwu", "radar", "gauge", "heatmap"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-lg font-medium ${activeTab === tab
                ? tab === "today"
                  ? "bg-blue-500 text-white"
                  : tab === "parts"
                  ? "bg-pink-500 text-white"
                  : tab === "uwu"
                  ? "bg-blue-500 text-white"
                  : tab === "radar"
                  ? "bg-pink-500 text-white"
                  : tab === "gauge"
                  ? "bg-blue-500 text-white"
                  : "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            {tab === "today"
              ? "Today"
              : tab === "parts"
              ? "ByParts"
              : tab === "uwu"
              ? "UwU"
              : tab === "radar"
              ? "Radar"
              : tab === "gauge"
              ? "Gauge"
              : "Heatmap"}
          </button>
        ))}
      </div>

      {/* Charts */}
      {activeTab === "today" && todaySeries.length > 0 && (
        <Chart options={todayOptions} series={todaySeries} type="line" height={320} />
      )}
      {activeTab === "parts" && partsSeries.length > 0 && (
        <Chart options={partsOptions} series={partsSeries} type="bar" height={320} />
      )}
      {activeTab === "uwu" && uwuSeries.length > 0 && (
        <Chart options={uwuOptions} series={uwuSeries} type="area" height={320} />
      )}
      {activeTab === "radar" && radarSeries.length > 0 && (
        <Chart options={radarOptions} series={radarSeries} type="radar" height={320} />
      )}
      {activeTab === "gauge" && gaugeSeries.length > 0 && (
        <Chart options={gaugeOptions} series={gaugeSeries} type="radialBar" height={320} />
      )}
      {activeTab === "heatmap" && heatmapSeries.length > 0 && (
        <Chart options={heatmapOptions} series={heatmapSeries} type="heatmap" height={350} />
      )}
    </div>
  );
}
