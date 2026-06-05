import { useNavigate, useParams } from "react-router-dom";
import { useWeldersChecklistMutations } from "../../hooks/useWeldersChecklistMutations";
import { useEffect, useState, type ChangeEvent } from "react";
import { weldersChecklistService } from "../../api/services/WeldersChecklistService";
import { ArrowLeft, Upload, Save } from "lucide-react";

export const WeldersEditEvaluation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEvaluation, isSaving } = useWeldersChecklistMutations();

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      weldersChecklistService.getById(Number(id)).then(setFormData);
    }
  }, [id]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const success = await updateEvaluation(Number(id), formData);
    if (success) navigate("/evaluaciones");
  };

  if (!formData) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-900 
        transition-colors hover:cursor-pointer"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-6">
          Editar Evaluación #{id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Evaluador
            </label>
            <input
              className="w-full p-3 border border-slate-200 rounded-xl outline-none 
              focus:ring-2 focus:ring-orange-500"
              value={formData.evaluatorName}
              onChange={(e) =>
                setFormData({ ...formData, evaluatorName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Promedio Final
            </label>
            <input
              type="number"
              className="w-full p-3 border border-slate-200 rounded-xl outline-none 
              focus:ring-2 focus:ring-orange-500"
              value={formData.finalAverage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  finalAverage: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Firmas y Evidencia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "EvidencePhoto",
              "SignatureColaborador",
              "SignatureSupervisor",
            ].map((field) => (
              <div
                key={field}
                className="p-4 border-2 border-dashed border-slate-200 rounded-2xl 
                text-center hover:border-orange-400 transition-colors"
              >
                <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">
                  {field}
                </label>
                <input
                  type="file"
                  className="hidden"
                  id={field}
                  onChange={(e) =>
                    handleFileChange(
                      e,
                      field.charAt(0).toLowerCase() + field.slice(1),
                    )
                  }
                />
                <label
                  htmlFor={field}
                  className="cursor-pointer text-orange-600 font-bold text-sm"
                >
                  Cambiar archivo
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            disabled={isSaving}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 
            rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all 
            active:scale-95 disabled:opacity-50 flex items-center gap-2 hover:cursor-pointer"
          >
            {isSaving ? (
              "Guardando..."
            ) : (
              <>
                <Save size={20} /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
