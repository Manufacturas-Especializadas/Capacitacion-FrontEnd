import { Calendar, Edit, Eye, FileText, Trash2, Users } from "lucide-react";
import type { TrainingReportSummary } from "../../../types/Types";

interface GridProps {
  data: TrainingReportSummary[];
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TrainingReportsGrid = ({
  data,
  onViewDetails,
  onEdit,
  onDelete,
}: GridProps) => {
  const getThemeConfig = (type: string) => {
    switch (type) {
      case "EMPAQUE":
        return {
          bgLight: "bg-emerald-50",
          textPrimary: "text-emerald-700",
          borderHover: "hover:border-emerald-200",
          iconBg: "bg-emerald-100",
        };
      case "SOLDADURA":
        return {
          bgLight: "bg-orange-50",
          textPrimary: "text-orange-700",
          borderHover: "hover:border-orange-200",
          iconBg: "bg-orange-100",
        };
      case "FABRICACION":
        return {
          bgLight: "bg-purple-50",
          textPrimary: "text-purple-700",
          borderHover: "hover:border-purple-200",
          iconBg: "bg-purple-100",
        };
      default:
        return {
          bgLight: "bg-slate-50",
          textPrimary: "text-slate-700",
          borderHover: "hover:border-slate-300",
          iconBg: "bg-slate-200",
        };
    }
  };

  if (data.length === 0) {
    return (
      <div
        className="bg-white border border-slate-200 rounded-2xl p-16 text-center 
        shadow-sm"
      >
        <div
          className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center 
          mx-auto mb-4"
        >
          <FileText size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-1">
          No hay reportes
        </h3>
        <p className="text-slate-500 font-medium text-sm">
          No se encontraron reportes que coincidan con tu búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((report) => {
        const theme = getThemeConfig(report.trainingType);

        return (
          <div
            key={report.id}
            className={`group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm 
            hover:shadow-xl ${theme.borderHover} transition-all duration-300 flex flex-col`}
          >
            {/* Cabecera de la tarjeta */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold text-slate-400">
                  ID: #{report.id}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] 
                  font-black tracking-widest uppercase ${theme.bgLight} ${theme.textPrimary}`}
                >
                  {report.trainingType}
                </span>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.bgLight} ${theme.textPrimary}`}
              >
                <FileText size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="mb-6 grow">
              <h3
                className="text-lg font-bold text-slate-900 leading-tight mb-3 
                group-hover:text-blue-600 transition-colors"
              >
                {report.leaderName}
              </h3>

              <div className="flex flex-wrap gap-y-3 gap-x-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-md text-slate-400">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-bold text-slate-400 uppercase 
                      tracking-wide"
                    >
                      Semana
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {report.weekNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-md text-slate-400">
                    <Users size={14} />
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-bold text-slate-400 uppercase 
                      tracking-wide"
                    >
                      Asistentes
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {report.attendeesCount} personas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full mb-4"></div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                Creado: {report.createdAt}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewDetails(report.id)}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-lg 
                  hover:bg-blue-50 transition-colors hover:cursor-pointer"
                  title="Ver Detalles"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(report.id)}
                  className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg 
                  hover:bg-emerald-50 transition-colors hover:cursor-pointer"
                  title="Editar Reporte"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(report.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg 
                  hover:bg-rose-50 transition-colors hover:cursor-pointer"
                  title="Eliminar Reporte"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
