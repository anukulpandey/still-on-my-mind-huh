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

      // Compute cumulative counts
      const maxLength = Math.max(data143.length, data1432.length);
      const seriesHer = [];
      const seriesHim = [];
      const categories = [];

      let cumHer = 0;
      let cumHim = 0;

      for (let i = 0; i < maxLength; i++) {
        if (i < data143.length) cumHer += 1;
        if (i < data1432.length) cumHim += 1;

        categories.push(
          (data143[i]?.time || data1432[i]?.time) &&
            new Date(data143[i]?.time || data1432[i]?.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
        );

        seriesHer.push(cumHer);
        seriesHim.push(cumHim);
      }

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
        },
        yaxis: {
          title: { text: "Cumulative Misses" },
        },
        stroke: { curve: "smooth", width: 3 },
        colors: ["#EC4899", "#3B82F6"], // pink for Her, blue for Him
        dataLabels: { enabled: false },
        tooltip: { enabled: true },
        grid: { borderColor: "#e5e7eb" }, // Tailwind gray-200
      });
    };

    loadData();
  }, []);

  if (!chartSeries.length) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-center font-semibold text-lg mb-4">{import.meta.env.VITE_CHART_TITLE} Syndrome</h2>
      <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
    </div>
  );
}
