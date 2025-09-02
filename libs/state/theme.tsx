import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const colors = {
  neutral100: "#e4e4e7",
  neutral200: "#d6d6d8",
  neutral300: "#9f9fa9",
  neutral400: "#71717b",
  neutral500: "#52525c",
  neutral600: "#27272a",
  base100: "#fd2489",
  base200: "#fc51a1",
  base300: "#d24386",
  base400: "#b03870",
  base500: "#8e2d5a",
  base600: "#6c2345",
  error100: "#ffabaf",
  error200: "#ff575f",
  error300: "#ff303a",
  error400: "#e7000b",
  error500: "#a10008",
  error600: "#6f0005",
  succes100: "#adffc5",
  succes200: "#70ff9a",
  succes300: "#36e067",
  succes400: "#16c749",
  succes500: "#008632",
  succes600: "#006626",
  info100: "#bddeff",
  info200: "#7abcff",
  info300: "#3d8aff",
  info400: "#155dfc",
  info500: "#0025cd",
  info600: "#001bba",
}

interface ThemeContextType {
  theme: typeof colors;
  themeId: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: {
  children: ReactNode;
}) {
  const systemTheme = useColorScheme();
  const [isDark, setDark] = useState(systemTheme === "dark");

  const toggleTheme = () => setDark((prev) => !prev);
  let theme = colors;

  if(isDark) {
    theme = {
      ...colors,
      neutral100: "#18181b",
      neutral200: "#27272a",
      neutral300: "#3f3f46",
      neutral400: "#52525c",
      neutral500: "#62626b",
      neutral600: "#e4e4e7",
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, themeId: isDark ? "dark" : "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if(!context) {
    throw new Error("useTheme must be within a ThemeProvider");
  }

   return context;
}