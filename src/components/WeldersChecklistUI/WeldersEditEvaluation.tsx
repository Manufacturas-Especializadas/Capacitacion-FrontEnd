import { useNavigate, useParams } from "react-router-dom";
import { useWeldersChecklistMutations } from "../../hooks/useWeldersChecklistMutations";
import { useEffect, useState, type ChangeEvent } from "react";
import { weldersChecklistService } from "../../api/services/WeldersChecklistService";
import { ArrowLeft, Save, FileCheck } from "lucide-react";

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
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
      >
        <h2 className="text-2xl font-black text-slate-900 mb-8 border-b pb-4">
          Editar Evaluación #{id}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InputField
            label="Nómina"
            value={formData.employeeNumber}
            onChange={(v: any) =>
              setFormData({ ...formData, employeeNumber: v })
            }
          />

          <InputField
            label="Evaluador"
            value={formData.evaluatorName}
            onChange={(v: any) =>
              setFormData({ ...formData, evaluatorName: v })
            }
          />

          <InputField
            label="Ref. Prueba Exclusiva"
            value={formData.exclusiveTestReference}
            onChange={(v: any) =>
              setFormData({ ...formData, exclusiveTestReference: v })
            }
          />

          <InputField
            label="Resultado Prueba"
            value={formData.exclusiveTestResult}
            onChange={(v: any) =>
              setFormData({ ...formData, exclusiveTestResult: v })
            }
          />

          <InputField
            label="Grado Práctico"
            type="number"
            value={formData.practicalGrade}
            onChange={(v: any) =>
              setFormData({ ...formData, practicalGrade: v })
            }
          />

          <InputField
            label="Grado Unión"
            type="number"
            value={formData.unionGrade}
            onChange={(v: any) => setFormData({ ...formData, unionGrade: v })}
          />

          <InputField
            label="Promedio Final"
            type="number"
            value={formData.finalAverage}
            onChange={(v: any) => setFormData({ ...formData, finalAverage: v })}
          />

          <InputField
            label="Nivel de Maestría"
            value={formData.masteryLevel}
            onChange={(v: any) => setFormData({ ...formData, masteryLevel: v })}
          />
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Firmas y Evidencia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "evidencePhoto", label: "Evidencia Fotográfica" },
              { key: "signatureColaborador", label: "Firma Colaborador" },
              { key: "signatureCoordinadorArea", label: "Firma Coord. Área" },
              {
                key: "signatureCoordCapacitacion",
                label: "Firma Coord. Capacitación",
              },
              { key: "signatureSupervisor", label: "Firma Supervisor" },
              { key: "signatureEvaluador", label: "Firma Evaluador" },
            ].map((item) => (
              <div
                key={item.key}
                className="p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-400 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    {item.label}
                  </label>
                  {formData[`${item.key}Url`] && (
                    <FileCheck size={16} className="text-green-500" />
                  )}
                </div>
                <input
                  type="file"
                  className="text-sm w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  onChange={(e) => handleFileChange(e, item.key)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            disabled={isSaving}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
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

const InputField = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
      value={value || ""}
      onChange={(e) =>
        onChange(
          type === "number" ? parseFloat(e.target.value) : e.target.value,
        )
      }
    />
  </div>
);
