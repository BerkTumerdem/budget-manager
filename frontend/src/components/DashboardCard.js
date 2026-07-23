import React from "react";
import { cn } from "../utils/cn";

const DashboardCard = ({ title, value, icon, className, type, highlight }) => {
  const getSurface = () => {
    if (type === "income") {
      return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60";
    }
    if (type === "expense") {
      return "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800/60";
    }
    if (highlight) {
      return "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60";
    }
    return "bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-700";
  };

  const getTitleStyle = () => {
    if (type === "income") return "text-emerald-700 dark:text-emerald-300";
    if (type === "expense") return "text-red-700 dark:text-red-300";
    if (highlight) return "text-amber-800 dark:text-amber-300";
    return "text-gray-600 dark:text-gray-300";
  };

  const getIconStyle = () => {
    if (type === "income") return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50";
    if (type === "expense") return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
    if (highlight) return "text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50";
    return "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50";
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 sm:p-6 shadow-sm transition-shadow duration-200 hover:shadow-md",
        getSurface(),
        className
      )}
    >
      <div className={cn("text-xs uppercase tracking-wider font-medium mb-2", getTitleStyle())}>
        {title}
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 break-words">
        {value}
      </div>
      {icon && (
        <div className={cn("text-xl p-3 rounded-xl w-fit", getIconStyle())}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
