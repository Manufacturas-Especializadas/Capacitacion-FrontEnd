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
      bgLight: "bg-blue-50",
      bgMedium: "bg-blue-100",
      textPrimary: "text-blue-600",
      textHover: "group-hover:text-blue-700",
    },
    orange: {
      borderHover: "hover:border-orange-200",
      bgLight: "bg-orange-50",
      bgMedium: "bg-orange-100",
      textPrimary: "text-orange-600",
      textHover: "group-hover:text-orange-700",
    },
    green: {
      borderHover: "hover:border-green-200",
      bgLight: "bg-green-50",
      bgMedium: "bg-green-100",
      textPrimary: "text-green-600",
      textHover: "group-hover:text-green-700",
    },
    purple: {
      borderHover: "hover:border-purple-200",
      bgLight: "bg-purple-50",
      bgMedium: "bg-purple-100",
      textPrimary: "text-purple-600",
      textHover: "group-hover:text-purple-700",
    },
  };

  const theme = themeStyles[colorTheme];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-3xl p-8 border border-slate-200 
      shadow-sm hover:shadow-xl ${theme.borderHover} transition-all duration-300 
      cursor-pointer overflow-hidden flex flex-col h-full`}
    >
      <div
        className={`absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 ${theme.bgLight} 
        rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity 
        duration-500 pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div
          className={`w-14 h-14 ${theme.bgMedium} ${theme.textPrimary} rounded-2xl flex 
          items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 
          transition-transform duration-300`}
        >
          {icon}
        </div>

        <h2
          className={`text-2xl font-bold text-slate-900 mb-3 ${theme.textHover} 
            transition-colors`}
        >
          {title}
        </h2>

        <p className="text-slate-500 leading-relaxed mb-8 grow">
          {description}
        </p>

        <div
          className={`flex items-center text-sm font-bold ${theme.textPrimary} mt-auto`}
        >
          <span className="group-hover:mr-2 transition-all">
            Ingresar al módulo
          </span>
          <ArrowRight
            size={16}
            className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 
            transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};
