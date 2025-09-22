import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../supabaseClient";
import { useDarkMode } from "../hooks/useDarkMode";

export default function MissesGraph() {
  const [activeTab, setActiveTab] = useState("today");
  const { isDarkMode } = useDarkMode();

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
  const [overallSeries, setOverallSeries] = useState([]);
  const [overallOptions, setOverallOptions] = useState({});

  useEffect(() => {
    const accentColors = isDarkMode ? ["#EF4444", "#FFFFFF"] : ["#EC4899", "#3B82F6"];
    const gridColor = isDarkMode ? "#444" : "#e5e7eb";
    const textColor = isDarkMode ? "#FFF" : "#000";

    const fetchMisses = async (code) => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("misses")
        .select("*")
        .eq("code", code)
        .gte("time", startOfDay.toISOString())
        .lte("time", endOfDay.toISOString())
        .order("time", { ascending: true });

      if (error) {
        console.error(`Error fetching misses for code ${code}:`, error);
        return [];
      }
      return data;
    };

    const fetchAllMisses = async (code) => {
      const { data, error } = await supabase
        .from("misses")
        .select("*")
        .eq("code", code)
        .order("time", { ascending: true });

      if (error) {
        console.error(`Error fetching all misses for code ${code}:`, error);
        return [];
      }
      return data;
    };

    const loadData = async () => {
      // --- Today’s Chart ---
      const data143 = await fetchMisses("143");
      const data1432 = await fetchMisses("1432");

      const allTimes = [
        ...data143.map((d) => ({ time: d.time, who: "Her" })),
        ...data1432.map((d) => ({ time: d.time, who: "Him" })),
      ].sort((a, b) => new Date(a.time) - new Date(b.time));

      let cumHer = 0,
        cumHim = 0;
      const todayCategories = [];
      const seriesHer = [];
      const seriesHim = [];

      allTimes.forEach((entry) => {
        if (entry.who === "Her") cumHer++;
        if (entry.who === "Him") cumHim++;
        todayCategories.push(
          new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        seriesHer.push(cumHer);
        seriesHim.push(cumHim);
      });

      setTodaySeries([
        { name: "Her", data: seriesHer },
        { name: "Him", data: seriesHim },
      ]);
      setTodayOptions({
        chart: { type: "line", zoom: { enabled: false }, toolbar: { show: true } },
        xaxis: { categories: todayCategories, labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        stroke: { curve: "smooth", width: 3 },
        colors: accentColors,
        grid: { borderColor: gridColor },
        legend: { labels: { colors: textColor } },
      });

      // --- By Parts ---
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
        chart: { type: "bar" },
        xaxis: { categories: partLabels, labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        colors: accentColors,
        plotOptions: { bar: { columnWidth: "40%", borderRadius: 6 } },
        grid: { borderColor: gridColor },
        legend: { labels: { colors: textColor } },
      });

      // --- UwU Area ---
      setUwuSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setUwuOptions({
        chart: { type: "area" },
        xaxis: { categories: partLabels, labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        colors: accentColors,
        stroke: { curve: "smooth", width: 2 },
        fill: { type: "gradient", gradient: { opacityFrom: 0.5, opacityTo: 0.1 } },
        grid: { borderColor: gridColor },
        legend: { labels: { colors: textColor } },
      });

      // --- Radar ---
      setRadarSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setRadarOptions({
        chart: { type: "radar" },
        xaxis: { categories: partLabels, labels: { style: { colors: textColor } } },
        colors: accentColors,
        stroke: { width: 2 },
        fill: { opacity: 0.3 },
        legend: { labels: { colors: textColor } },
      });

      // --- Gauge ---
      const totalHer = data143.length;
      const totalHim = data1432.length;
      const total = totalHer + totalHim || 1;
      setGaugeSeries([Math.round((totalHer / total) * 100), Math.round((totalHim / total) * 100)]);
      setGaugeOptions({
        chart: { type: "radialBar" },
        plotOptions: { radialBar: { dataLabels: { value: { formatter: (val) => `${val}%` } } } },
        labels: ["Her", "Him"],
        colors: accentColors,
        legend: { labels: { colors: textColor } },
      });

      // --- Heatmap ---
      const hours = Array.from({ length: 24 }, (_, i) => i);
      setHeatmapSeries([
        {
          name: "Her",
          data: hours.map((h) => ({
            x: `${h}:00`,
            y: data143.filter((d) => new Date(d.time).getHours() === h).length,
          })),
        },
        {
          name: "Him",
          data: hours.map((h) => ({
            x: `${h}:00`,
            y: data1432.filter((d) => new Date(d.time).getHours() === h).length,
          })),
        },
      ]);
      setHeatmapOptions({
        chart: { type: "heatmap" },
        colors: accentColors,
        xaxis: { labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        grid: { borderColor: gridColor },
        legend: { labels: { colors: textColor } },
      });

      // --- Overall ---
      const data143All = await fetchAllMisses("143");
      const data1432All = await fetchAllMisses("1432");
      const dateMapHer = {};
      data143All.forEach((d) => {
        const date = new Date(d.time).toLocaleDateString();
        dateMapHer[date] = (dateMapHer[date] || 0) + 1;
      });
      const dateMapHim = {};
      data1432All.forEach((d) => {
        const date = new Date(d.time).toLocaleDateString();
        dateMapHim[date] = (dateMapHim[date] || 0) + 1;
      });
      const allDates = Array.from(new Set([...Object.keys(dateMapHer), ...Object.keys(dateMapHim)])).sort(
        (a, b) => new Date(a) - new Date(b)
      );
      setOverallSeries([
        { name: "Her", data: allDates.map((d) => dateMapHer[d] || 0) },
        { name: "Him", data: allDates.map((d) => dateMapHim[d] || 0) },
      ]);
      setOverallOptions({
        chart: { type: "line" },
        xaxis: { categories: allDates, labels: { style: { colors: textColor } } },
        yaxis: { labels: { style: { colors: textColor } } },
        stroke: { curve: "smooth", width: 3 },
        colors: accentColors,
        grid: { borderColor: gridColor },
        legend: { labels: { colors: textColor } },
      });
    };

    loadData();
  }, [isDarkMode]);

  return (
    <div
      className={`w-full max-w-lg mx-auto mt-8 p-4 rounded-xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <h2 className="text-center font-semibold text-lg mb-2">
        <span className={isDarkMode ? "text-white" : "text-blue-500"}>
          {import.meta.env.VITE_CHART_TITLE}
        </span>{" "}
        <span className={isDarkMode ? "text-red-500" : "text-pink-500"}>Syndrome</span>
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {["today", "parts", "uwu", "radar", "gauge", "heatmap", "overall"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? isDarkMode
                  ? "bg-white text-red-600"
                  : "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-black border border-white text-white"
                : "bg-white border border-black text-black"
            }`}
          >
            {tab === "overall" ? "Overall" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
      {activeTab === "overall" && overallSeries.length > 0 && (
        <Chart options={overallOptions} series={overallSeries} type="line" height={320} />
      )}
    </div>
  );
}
