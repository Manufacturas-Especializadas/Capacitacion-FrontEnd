import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  colorTheme: "blue" | "orange" | "green" | "purple";
}

export const ModuleCard = ({
  title,
  description,
  icon,
  onClick,
  colorTheme,
}: ModuleCardProps) => {
  const themeStyles = {
    blue: {
      borderHover: "hover:border-blue-200",
      ring: "focus-visible:ring-blue-500",
      iconWrap:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-200",
      textHover: "group-hover:text-blue-700",
    },
    orange: {
      borderHover: "hover:border-orange-200",
      ring: "focus-visible:ring-orange-500",
      iconWrap:
        "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-orange-200",
      textHover: "group-hover:text-orange-700",
    },
    green: {
      borderHover: "hover:border-emerald-200",
      ring: "focus-visible:ring-emerald-500",
      iconWrap:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-200",
      textHover: "group-hover:text-emerald-700",
    },
    purple: {
      borderHover: "hover:border-purple-200",
      ring: "focus-visible:ring-purple-500",
      iconWrap:
        "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-purple-200",
      textHover: "group-hover:text-purple-700",
    },
  };

  const theme = themeStyles[colorTheme];

  return (
    <button
      onClick={onClick}
      className={`group text-left w-full relative bg-white rounded-3xl p-6 md:p-8 
      border border-slate-200/80 shadow-sm transition-all duration-300 
      ${theme.borderHover} hover:shadow-xl hover:shadow-slate-200/50 
      hover:-translate-y-1 focus:outline-none focus-visible:ring-2
      hover:cursor-pointer
      ${theme.ring} flex flex-col h-full`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center 
          transition-all duration-300 shadow-sm ${theme.iconWrap}`}
        >
          {icon}
        </div>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 
          text-slate-400 group-hover:bg-slate-100 transition-colors duration-300"
        >
          <ArrowRight
            size={18}
            className={`transform transition-transform duration-300 group-hover:-rotate-45 ${theme.textHover}`}
          />
        </div>
      </div>

      <h2
        className={`text-xl md:text-2xl font-bold text-slate-900 mb-3 
        transition-colors duration-300 ${theme.textHover}`}
      >
        {title}
      </h2>

      <p className="text-slate-500 text-sm md:text-base leading-relaxed grow">
        {description}
      </p>
    </button>
  );
};
