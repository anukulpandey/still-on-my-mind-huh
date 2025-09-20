import { useState } from "react";

export default function CodeForm({ onSave }) {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [code, setCode] = useState(localStorage.getItem("code") || "");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    if (!name || !code) return alert("Enter both name and code");
    localStorage.setItem("name", name);
    localStorage.setItem("code", code);
    setMessage("Saved! You are now on Mind.");
    onSave();
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center px-4 font-sans">
      <input
        className="w-full max-w-xs p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full max-w-xs p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter Code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button
        className="w-full max-w-xs p-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        onClick={handleSave}
      >
        Save
      </button>
      {message && <div className="mt-2 text-green-600">{message}</div>}
    </div>
  );
}
