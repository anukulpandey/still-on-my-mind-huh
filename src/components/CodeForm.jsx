import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

export default function CodeForm({ onSave }) {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [code, setCode] = useState(localStorage.getItem("code") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { isDarkMode } = useDarkMode();

  const handleSave = () => {
    if (!name || !code) return alert("Enter both name and code");

    if (code !== "143" && code !== "1432") {
      setError("Incorrect code");
      setMessage("");
      return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("code", code);
    setMessage("Saved! You are now on Mind.");
    setError("");
    onSave();
  };

  return (
    <div
      className={`flex flex-col gap-3 items-center justify-center px-4 py-6 font-sans rounded-2xl shadow-lg transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <input
        className={`w-full max-w-xs p-3 rounded-lg border focus:outline-none focus:ring-2 ${
          isDarkMode
            ? "bg-black border-white text-white placeholder-white focus:ring-white"
            : "bg-white border-black text-black placeholder-gray-500 focus:ring-blue-500"
        }`}
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={`w-full max-w-xs p-3 rounded-lg border focus:outline-none focus:ring-2 ${
          isDarkMode
            ? "bg-black border-white text-white placeholder-white focus:ring-white"
            : "bg-white border-black text-black placeholder-gray-500 focus:ring-blue-500"
        }`}
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className={`w-full max-w-xs p-3 rounded-lg font-semibold transition-colors ${
          isDarkMode
            ? "bg-white text-red-600 hover:bg-red-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={handleSave}
      >
        Save
      </button>
      {message && (
        <div className={`mt-2 font-medium ${isDarkMode ? "text-white" : "text-green-600"}`}>
          {message}
        </div>
      )}
      {error && (
        <div className={`mt-2 font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
          {error}
        </div>
      )}
    </div>
  );
}
