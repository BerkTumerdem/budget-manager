import React from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import AnimatedBackground from "./AnimatedBackground";

export default function Layout({ children }) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-950 dark:via-gray-900 dark:to-gray-950' : 'bg-white'} text-gray-900 dark:text-white transition-colors duration-300 relative overflow-hidden`}>
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
