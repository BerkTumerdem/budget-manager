import React from "react";
import { useTheme } from "../context/ThemeContext";

/** Subtle static atmosphere — no particles or looping motion. */
export default function AnimatedBackground() {
  const { isDarkMode } = useTheme();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          isDarkMode
            ? "from-gray-950 via-gray-900 to-emerald-950/40"
            : "from-gray-50 via-white to-emerald-50/80"
        }`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
          isDarkMode
            ? "from-emerald-500/8 via-transparent to-transparent"
            : "from-emerald-400/12 via-transparent to-transparent"
        }`}
      />
    </div>
  );
}
