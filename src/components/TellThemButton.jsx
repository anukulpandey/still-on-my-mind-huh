import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TellThemButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastMiss, setLastMiss] = useState(null);

  const storedCode = localStorage.getItem("code");

  const fetchLastMiss = async () => {
    if (!storedCode) return;

    const { data, error } = await supabase
      .from("misses")
      .select("*")
      .eq("code", storedCode)
      .order("time", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching last miss:", error);
    } else if (data) {
      const timeAgo = getTimeAgo(new Date(data.time));
      setLastMiss(`${data.name} missed you ${timeAgo}`);
    }
  };

  useEffect(() => {
    fetchLastMiss();
  }, []);

  const handleTellThem = async () => {
    setLoading(true);
    setMessage("");

    const storedName = localStorage.getItem("name");

    const { error } = await supabase
      .from("misses")
      .insert([{ code: storedCode, name: storedName ,  time: new Date().toISOString()}]);

    if (error) {
      setMessage("Error sending message");
      console.error(error);
    } else {
      setMessage("Message sent!");
      fetchLastMiss(); // refresh the last miss after sending
    }

    setLoading(false);
  };

  // Helper to format time ago
  const getTimeAgo = (past) => {
    const now = new Date();
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    return `${diffDay} days ago`;
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center px-4 font-sans">
      <div className="text-xl font-semibold mb-1 text-center text-blue-800">
        Missing me huh?
      </div>

      {lastMiss && (
        <div className="text-center font-semibold text-red-700">{lastMiss}</div>
      )}

      <button
        className="w-full max-w-xs p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        onClick={handleTellThem}
        disabled={loading}
      >
        {loading ? "Sending…" : "Tell Them You Are on Mind"}
      </button>

      {message && <div className="text-green-600">{message}</div>}
    </div>
  );
}
