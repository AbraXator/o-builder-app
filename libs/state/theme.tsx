import { createContext, ReactNode, useContext, useState } from "react";
import { NamedStyles, useColorScheme } from "react-native";

const colors = {
  text: "#27272a",
  neutral100: "#f4f4f5",
  neutral200: "#e4e4e7",
  neutral300: "#d6d6d8",
  neutral400: "#9f9fa9",
  neutral500: "#71717b",
  neutral600: "#52525c",
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

  if(isDark) {
    theme = {
      ...colors,
      neutral100: "#040405",
      neutral200: "#18181b",
      neutral300: "#27272a",
      neutral400: "#3f3f46",
      neutral500: "#52525c",
      neutral600: "#62626b",
      text: "#e4e4e7",
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

export function joinedStyles<
  T extends NamedStyles<>
>({  })