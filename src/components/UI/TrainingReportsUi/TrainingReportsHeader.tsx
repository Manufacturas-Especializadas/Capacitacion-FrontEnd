import { FileText, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TrainingReportsHeader = ({
  searchTerm,
  onSearchChange,
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center 
        gap-4 mb-6"
      >
        <div>
          <h1
            className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex 
            items-center gap-3"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            Reportes de Entrenamiento
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-2">
            Gestiona los entrenamientos de Empaque, Soldadura y Fabricación.
          </p>
        </div>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => navigate("/reporte-entrenamiento/nuevo")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 
            bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl 
            shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Union de soldadura
          </button>
          <button
            onClick={() =>
              navigate("/reportes-entrenamientos/temas-entrenamientos")
            }
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 
            bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold rounded-xl 
            shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Temas de entrenamientos
          </button>
          <button
            onClick={() => navigate("/reportes-entrenaminetos/nuevo")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 
            bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl 
            shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Nuevo Reporte
          </button>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex 
        items-center"
      >
        <div className="relative w-full md:w-96">
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none 
            text-slate-400"
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por líder o ID de reporte..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 
            rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 
            focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
};
