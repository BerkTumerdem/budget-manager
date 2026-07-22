import React from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import AnimatedBackground from "./AnimatedBackground";

export default function Layout({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen min-h-[100dvh] ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
          : "bg-gray-50"
      } text-gray-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden`}
    >
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto relative z-10 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
