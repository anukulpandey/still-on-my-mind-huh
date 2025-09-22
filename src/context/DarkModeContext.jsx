import { createContext, useContext } from "react";
import { useDarkMode } from "../hooks/useDarkMode";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}