import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { supabase } from "../supabaseClient";

export default function MissesGraph() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

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

      // Merge + sort times
      const allTimes = [
        ...data143.map((d) => ({ time: d.time, who: "Her" })),
        ...data1432.map((d) => ({ time: d.time, who: "Him" })),
      ].sort((a, b) => new Date(a.time) - new Date(b.time));

      let cumHer = 0;
      let cumHim = 0;

      const seriesHer = [];
      const seriesHim = [];
      const categories = [];

      allTimes.forEach((entry) => {
        if (entry.who === "Her") cumHer++;
        if (entry.who === "Him") cumHim++;

        categories.push(
          new Date(entry.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        seriesHer.push(cumHer);
        seriesHim.push(cumHim);
      });

      setChartSeries([
        { name: "Her", data: seriesHer },
        { name: "Him", data: seriesHim },
      ]);

      setChartOptions({
        chart: {
          id: "misses-chart",
          type: "line",
          toolbar: { show: true },
          zoom: { enabled: false },
        },
        xaxis: {
          categories,
          title: { text: "Time" },
          labels: {
            rotate: -45,
            style: { fontSize: "11px" },
          },
          tickAmount: Math.min(categories.length, 8), // reduce clutter
        },
        yaxis: {
          title: { text: "Cumulative Misses" },
        },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#EC4899", "#3B82F6"], // pink for Her, blue for Him
        dataLabels: { enabled: false },
        tooltip: { enabled: true },
        grid: { borderColor: "#e5e7eb" },
      });
    };

    loadData();
  }, []);

  if (!chartSeries.length) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-center font-semibold text-lg mb-4">
        <span className="text-blue-500">Still On My Mind, </span>
        <span className="text-pink-500">Huh?</span>
      </h2>
      <Chart options={chartOptions} series={chartSeries} type="line" height={320} />
    </div>
  );
}
