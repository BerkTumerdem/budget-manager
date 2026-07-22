import React from "react";
import { cn } from "../utils/cn";

const DashboardCard = ({ title, value, icon, className, type, highlight }) => {
  const getGradient = () => {
    if (type === "income") {
      return "from-emerald-500/40 via-emerald-600/30 to-emerald-700/40";
    }
    if (type === "expense") {
      return "from-red-500/40 via-red-600/30 to-red-700/40";
    }
    if (highlight) {
      return "from-amber-500/40 via-amber-600/30 to-amber-700/40";
    }
    return "from-gray-800/50 via-gray-700/40 to-gray-900/50";
  };

  const getIconStyle = () => {
    if (type === "income") {
      return "text-emerald-400 dark:text-emerald-300";
    }
    if (type === "expense") {
      return "text-red-400 dark:text-red-300";
    }
    if (highlight) {
      return "text-amber-400 dark:text-amber-300";
    }
    return "text-gray-400 dark:text-gray-300";
  };

  return (
    <div
      className={cn(
        "card hover-glow",
        "bg-gradient-to-br",
        getGradient(),
        "border-glow",
        "dark:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        "backdrop-blur-md",
        className
      )}
    >
      <div className="text-xs text-emerald-200/90 dark:text-emerald-300/90 uppercase tracking-wider font-medium mb-2 text-glow">
        {title}
      </div>
      <div className="text-4xl font-extrabold text-white dark:text-white mb-3 drop-shadow-lg">
        {value}
      </div>
      {icon && (
        <div className={cn(
          "text-3xl mt-auto p-4 rounded-xl w-fit backdrop-blur-md",
          "bg-white/10 dark:bg-white/10",
          "border border-white/20 dark:border-white/20",
          "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          getIconStyle()
        )}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
