import { Eye, Edit2, Trash2 } from "lucide-react";

interface EvaluationCardProps {
  evaluation: any;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

export const WeldersEvaluationCard = ({
  evaluation,
  onDelete,
  onEdit,
  onView,
}: EvaluationCardProps) => {
  const getMasteryColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "experto":
        return "bg-green-100 text-green-800";
      case "competente":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 
      transition-all duration-300 ease-in-out 
      hover:shadow-lg hover:border-orange-200 hover:scale-[1.02] 
      group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-lg font-bold text-slate-900 group-hover:text-orange-700 
            transition-colors"
          >
            {evaluation.employeeName}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Nómina: {evaluation.employeeNumber}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
            ${getMasteryColor(evaluation.masteryLevel)}`}
        >
          {evaluation.masteryLevel}
        </span>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Promedio
          </p>
          <p className="text-2xl font-black text-slate-800">
            {evaluation.finalAverage}
          </p>
        </div>
        <div className="h-8 w-px bg-slate-100" />
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Fecha
          </p>
          <p className="text-sm font-semibold text-slate-600">
            {new Date(evaluation.evaluationDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end border-t border-slate-100 pt-4">
        <button
          onClick={() => onView(evaluation.id)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 
          rounded-lg transition-colors hover:cursor-pointer"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => onEdit(evaluation.id)}
          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 
          rounded-lg transition-colors hover:cursor-pointer"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(evaluation.id)}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 
          rounded-lg transition-colors hover:cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
