import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../supabaseClient";

export default function MissesGraph() {
  const [activeTab, setActiveTab] = useState("today");
  const [todaySeries, setTodaySeries] = useState([]);
  const [todayOptions, setTodayOptions] = useState({});
  const [partsSeries, setPartsSeries] = useState([]);
  const [partsOptions, setPartsOptions] = useState({});

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

      // --- Today chart ---
      const allTimes = [
        ...data143.map((d) => ({ time: d.time, who: "Her" })),
        ...data1432.map((d) => ({ time: d.time, who: "Him" })),
      ].sort((a, b) => new Date(a.time) - new Date(b.time));

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

      // --- By Parts chart ---
      const partLabels = ["0–6h", "6–12h", "12–18h", "18–24h"];
      const partCountsHer = [0, 0, 0, 0];
      const partCountsHim = [0, 0, 0, 0];

      allTimes.forEach((entry) => {
        const hour = new Date(entry.time).getHours();
        const bucket = Math.floor(hour / 6);
        if (entry.who === "Her") partCountsHer[bucket]++;
        if (entry.who === "Him") partCountsHim[bucket]++;
      });

      // 🔑 No rolling cumulative here — just per bucket counts
      setPartsSeries([
        { name: "Her", data: partCountsHer },
        { name: "Him", data: partCountsHim },
      ]);
      setPartsOptions({
        chart: { id: "parts", type: "bar", toolbar: { show: true } },
        xaxis: { categories: partLabels, title: { text: "Day Parts" } },
        yaxis: { title: { text: "Misses in Part" } },
        colors: ["#EC4899", "#3B82F6"],
        plotOptions: {
          bar: { horizontal: false, columnWidth: "40%", borderRadius: 6 },
        },
        dataLabels: { enabled: true },
        grid: { borderColor: "#e5e7eb" },
      });
    };

    loadData();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <h2 className="text-center font-semibold text-lg mb-2">
        <span className="text-blue-500">Still On My Mind, </span>
        <span className="text-pink-500">Huh?</span>
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-4 py-1 rounded-lg font-medium ${
            activeTab === "today"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`px-4 py-1 rounded-lg font-medium ${
            activeTab === "parts"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ByParts
        </button>
      </div>

      {/* Chart */}
      {activeTab === "today" && todaySeries.length > 0 && (
        <Chart options={todayOptions} series={todaySeries} type="line" height={320} />
      )}
      {activeTab === "parts" && partsSeries.length > 0 && (
        <Chart options={partsOptions} series={partsSeries} type="bar" height={320} />
      )}
    </div>
  );
}
