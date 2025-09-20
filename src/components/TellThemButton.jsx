import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function TellThemButton() {
  const [loading, setLoading] = useState(false);
  const [lastMiss, setLastMiss] = useState(null);

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
    <div className="flex flex-col gap-3 items-center justify-center px-4 font-sans">
      {/* Toast at bottom-right */}
      <Toaster position="bottom-right" reverseOrder={false} />

    

      <div className="text-xl font-semibold mb-1 text-center text-blue-800">
      Missing {storedCode=="143"?"him?":"her?"} 🥺
      </div>

      <button
        className="w-full max-w-xs p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        onClick={handleTellThem}
        disabled={loading}
      >
        
        {loading ? "Sending…" : `Tell ${storedCode=="143"?"him, He":"her, She"} is on your mind! 😭`}
      </button>
      {lastMiss && (
        <div className="text-center font-semibold text-red-700">{lastMiss}</div>
      )}
    </div>
  );
}
