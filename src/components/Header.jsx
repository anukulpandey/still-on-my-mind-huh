import { useDarkMode } from "../hooks/useDarkMode";

export default function Header() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <div className={`relative text-center py-4 ${isDarkMode ? "bg-black" : "bg-blue-600"}`}>
      <span className="text-white font-bold text-xl">Still On My Mind! </span>
      <span className={`${isDarkMode?"text-red-600":"text-pink-500"} font-bold text-xl`}>Huh?</span>

      <div className="absolute top-4 right-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-gray-700 transition-colors"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>
  );
}
