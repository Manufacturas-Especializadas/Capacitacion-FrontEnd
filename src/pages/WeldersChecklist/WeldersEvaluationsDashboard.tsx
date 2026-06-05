import { useState, useEffect } from "react";
import { weldersChecklistService } from "../../api/services/WeldersChecklistService";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WeldersEvaluationCard } from "../../components/WeldersChecklistUI/WeldersEvaluationCard";

export const WeldersEvaluationsDashboard = () => {
  const [evals, setEvals] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    const data = await weldersChecklistService.getAll();
    setEvals(data);
  };

  const filtered = evals.filter((e) =>
    e.employeeName.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="p-8 max-w-8xl mx-auto min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Historial de Evaluaciones
          </h1>
          <p className="text-slate-500">
            Gestiona y consulta las evaluaciones de soldadura
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 
              rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
            />
          </div>
          <button
            onClick={() => navigate("/nuevo")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 
            rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all 
            active:scale-95 hover:cursor-pointer"
          >
            <Plus size={20} /> Nuevo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((evaluation) => (
          <WeldersEvaluationCard
            key={evaluation.id}
            evaluation={evaluation}
            onView={(id) => navigate(`/ver/${id}`)}
            onEdit={(id) => navigate(`/editar/${id}`)}
            onDelete={async (id) => {
              if (confirm("¿Seguro que quieres borrar esta evaluación?")) {
                await weldersChecklistService.delete(id);
                loadEvaluations();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
