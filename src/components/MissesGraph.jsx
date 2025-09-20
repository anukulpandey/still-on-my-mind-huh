import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function MissesGraph() {
  const [misses, setMisses] = useState([]);

  useEffect(() => {
    const fetchMisses = async () => {
      const { data, error } = await supabase
        .from("misses")
        .select("*")
        .order("time", { ascending: false })
        .limit(25);

      if (error) {
        console.error("Error fetching misses:", error);
      } else {
        // Reverse to show oldest first
        setMisses(data.reverse());
      }
    };

    fetchMisses();
  }, []);

  // Format data for chart
  const chartData = misses.map(m => ({
    name: m.name,
    time: new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  if (!misses.length) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-4">
      <h2 className="text-center font-semibold text-lg mb-4">Last 25 Misses</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="name" stroke="#007AFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
