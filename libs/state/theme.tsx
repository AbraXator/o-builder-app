import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const colors = {
  // Base neutrals (slightly rosy, for a playful feel)
  neutral100: "#FFF7FB", // main background
  neutral200: "#FFEAF5", // subtle surface
  neutral300: "#FFD7EC", // cards / panels
  neutral400: "#F6B6D8", // borders / subtle lines
  neutral500: "#C76AA0",
  neutral600: "#4B1230", // primary text
  neutral700: "#2A0718", // headings / strongest text

  control100: "#FFE5F3", // tracks, light fills, subtle control bg
  control200: "#FFB9DE", // hovers, selected bg
  control300: "#F97AB7", // softer main control
  control400: "#ED3288", // main action / active control
  control500: "#C5226C", // pressed / strong state

  accent100: "#f5d0beff",
  accent200: "#f9a27aff",
  accent300: "#f37b44ff",

  error100: "#ffabaf",
  error200: "#ff303a",
  error300: "#a10008",

  succes100: "#70ff9a",
  succes200: "#36e067",
  succes300: "#008632",

  info100: "#bddeff",
  info200: "#3d8aff",
  info300: "#0025cd",

  disabled: "#bababa",
}
export type ThemeType = typeof colors;

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

  if (isDark) {
    theme = {
      ...colors,

      neutral100: "#0D0208", // main background
      neutral200: "#160411", // elevated background
      neutral300: "#26071D", // cards / panels
      neutral400: "#3A102C", // borders / outlines
      neutral500: "#B96A99",
      neutral600: "#F9D8E8", // primary text
      neutral700: "#FFEFF6", // strongest text

      // Controls (dark variants, still clearly pink)
      control100: "#3A102C", // subtle tracks / idle
      control200: "#5A1741", // hover bg
      control300: "#D9499A", // softer main control on dark
      control400: "#ED3288", // main action on dark
      control500: "#FF8CBC", // highlight / glow accents

      accent100: "#f37b44ff",
      accent200: "#f9a27aff",
      accent300: "#f5d0beff",
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
  if (!context) {
    throw new Error("useTheme must be within a ThemeProvider");
  }

  return context;
}