import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("uv-theme");
    return saved !== null ? saved === "dark" : true; // default dark
  });

  useEffect(() => {
    localStorage.setItem("uv-theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  // Centralised token object — import this wherever you need theme colors
  const t = isDark ? {
    // ── Dark palette ──────────────────────────────────────────────
    bg:          "#060e1c",
    bgPanel:     "rgba(8,16,32,0.97)",
    bgCard:      "rgba(255,255,255,0.03)",
    bgCardHover: "rgba(255,255,255,0.06)",
    border:      "rgba(255,255,255,0.06)",
    borderGreen: "rgba(46,204,113,0.18)",
    textPrimary: "#e8eaf0",
    textSecond:  "#c8d0e0",
    textMuted:   "#7a8aaa",
    textDim:     "#3a4560",
    sidebar:     "rgba(8,16,32,0.97)",
    topbar:      "rgba(6,14,28,0.85)",
    statsBar:    "rgba(6,14,28,0.75)",
  } : {
    // ── Light palette ─────────────────────────────────────────────
    bg:          "#f0f4f8",
    bgPanel:     "#ffffff",
    bgCard:      "#f7f9fc",
    bgCardHover: "#eef2f7",
    border:      "rgba(0,0,0,0.07)",
    borderGreen: "rgba(46,204,113,0.35)",
    textPrimary: "#0f1923",
    textSecond:  "#1e2d3d",
    textMuted:   "#4a6080",
    textDim:     "#8a9ab8",
    sidebar:     "#ffffff",
    topbar:      "rgba(240,244,248,0.92)",
    statsBar:    "rgba(240,244,248,0.88)",
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
