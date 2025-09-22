import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { useDarkMode } from "../hooks/useDarkMode";

export default function TellThemButton() {
  const [loading, setLoading] = useState(false);
  const [lastMiss, setLastMiss] = useState(null);
  const { isDarkMode } = useDarkMode();

  const storedCode = localStorage.getItem("code");

  const fetchLastMiss = async () => {
    if (!storedCode) return;
    let codeToFetch = "143";
    if (storedCode === "143") codeToFetch = "1432";

    const { data, error } = await supabase
      .from("misses")
      .select("*")
      .eq("code", codeToFetch)
      .order("time", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching last miss:", error);
      setLastMiss(`She ain't missing you :(`);
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
    const storedName = localStorage.getItem("name");

    const { error } = await supabase
      .from("misses")
      .insert([{ code: storedCode, name: storedName, time: new Date().toISOString() }]);

    if (error) {
      console.error(error);
      toast.error("Error sending message");
    } else {
      toast.success("Message sent!");
      fetchLastMiss();
    }

    setLoading(false);
  };

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
    <div
      className={`flex flex-col gap-3 items-center justify-center px-4 py-6 font-sans rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Toast */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <button
        className={`w-full max-w-xs p-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
          isDarkMode
            ? "bg-white text-red-600 hover:bg-red-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={handleTellThem}
        disabled={loading}
      >
        {loading
          ? "Sending…"
          : `Tell ${storedCode === "143" ? "him, He" : "her, She"} is on your mind! 😭`}
      </button>

      {lastMiss && (
        <div
          className={`text-center font-semibold mt-2 ${
            isDarkMode ? "text-white" : "text-red-700"
          }`}
        >
          {lastMiss}
        </div>
      )}
    </div>
  );
}
