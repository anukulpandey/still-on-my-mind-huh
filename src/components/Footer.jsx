import { useDarkMode } from "../hooks/useDarkMode";

export default function Footer() {
    const { isDarkMode } = useDarkMode();
    return (
      <footer className={`w-full py-4 text-center  text-sm border-t border-gray-200 mt-auto ${isDarkMode ? "bg-black border-gray-700 text-white" : "bg-white text-gray-500"}`}>
        Made with <span className="text-blue-500">💙</span> by <span className="font-bold">{import.meta.env.VITE_FOOTER_TEXT}</span>
      </footer>
    );
  }
  