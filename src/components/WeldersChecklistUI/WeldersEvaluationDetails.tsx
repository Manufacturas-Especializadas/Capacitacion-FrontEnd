import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { WelderEvaluationsDetails } from "../../types/Types";
import { weldersChecklistService } from "../../api/services/WeldersChecklistService";
import { ArrowLeft, Award, CheckCircle2, FileText } from "lucide-react";

export const WeldersEvaluationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<WelderEvaluationsDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      weldersChecklistService
        .getById(Number(id))
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Cargando detalles...</div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">
        No se encontró la evaluación
      </div>
    );
  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 
        transition-colors font-medium hover:cursor-pointer"
      >
        <ArrowLeft size={20} /> Volver al dashboard
      </button>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {data.employeeName}
            </h1>
            <p className="text-slate-500 mt-1">
              Nómina: {data.employeeNumber} • Evaluación # {data.id}
            </p>
          </div>
          <div
            className="bg-orange-50 px-4 py-2 rounded-xl text-orange-700 font-bold 
            flex items-center gap-2"
          >
            <Award size={20} /> {data.masteryLevel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> Práctica
          </h2>
          <div className="space-y-3">
            {data.practicalAnswers.map((ans, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-slate-50 pb-2"
              >
                <span className="text-sm text-slate-600 truncate mr-4">
                  {ans.questionText}
                </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                  {ans.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-500" /> Atributos de
            Unión
          </h2>
          <div className="space-y-3">
            {data.unionAnswers.map((ans, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-slate-50 pb-2"
              >
                <span className="text-sm font-medium text-slate-900">
                  {ans.attributeName}
                </span>
                <span className="text-sm text-slate-500">{ans.answerText}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
