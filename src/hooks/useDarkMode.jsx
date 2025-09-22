import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDarkMode, setIsDarkModeState] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem("darkMode");
    if (dark === "true") setIsDarkModeState(true);
  }, []);

  const setIsDarkMode = (value) => {
    localStorage.setItem("darkMode", value);
    setIsDarkModeState(value);
    window.location.reload();
  };

  return { isDarkMode, setIsDarkMode };
}
