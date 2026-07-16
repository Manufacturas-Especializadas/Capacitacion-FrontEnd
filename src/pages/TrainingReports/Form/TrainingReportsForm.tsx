import { FileText, Save, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTrainingTopics } from "../../../hooks/useTrainingTopics";
import { useEmployees } from "../../../hooks/useEmployees";
import { AttendeesSection } from "./AttendeesSection";
import { AttendeeSelectionCard } from "./FormUI/AttendeeSelectionCard";
import { GeneralInfoCard } from "./FormUI/GeneralInfoCard";
import { useTrainingReports } from "../../../hooks/useTrainingReports";
import type { CreateTrainingReportPayload } from "../../../types/Types";
import { useCatalogs } from "../../../hooks/useCatalogs";

const getWeekNumber = (d: Date): number => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const TrainingReportsForm = () => {
  const navigate = useNavigate();
  const { topics, fetchTopics } = useTrainingTopics();
  const { employees, isLoadingEmployees } = useEmployees();
  const { createReport, isSubmitting } = useTrainingReports();
  const { lines, fetchLines } = useCatalogs();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<any>({
    leaderName: "",
    leaderNomina: "",
    weekNumber: getWeekNumber(new Date()),
    trainingType: "",
    observations: "",
    instructorSignature: null,
    coordinatorSignature: null,
    safetySignature: null,
    attendees: [],
  });

  useEffect(() => {
    fetchTopics();
    fetchLines();
  }, [fetchTopics, fetchLines]);

  const availableTopics = topics.filter(
    (t) => t.trainingType === formData.trainingType,
  );
  const topicOptions = availableTopics.map((t) => ({
    value: t.topicCode,
    label: `${t.topicCode} - ${t.topicName}`,
  }));

  const handleMasterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGlobalFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setFormData((prev: any) => ({ ...prev, trainingType: type }));
  };

  const addAttendeeRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      attendees: [
        ...prev.attendees,
        {
          id: crypto.randomUUID(),
          employeeNumber: "",
          employeeId: null,
          lineId: null,
          name: "",
          line: "",
          topicCode: "",
          dayMonday: false,
          dayTuesday: false,
          dayWednesday: false,
          dayThursday: false,
          dayFriday: false,
          daySaturday: false,
          daySunday: false,
        },
      ],
    }));
  };

  const removeAttendeeRow = (idToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      attendees: prev.attendees.filter((a: any) => a.id !== idToRemove),
    }));
  };

  const handleAttendeeFileChange = (
    id: string,
    field: string,
    file: File | null,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      attendees: prev.attendees.map((a: any) =>
        a.id === id ? { ...a, [field]: file } : a,
      ),
    }));
  };

  const handleAttendeeChange = (
    id: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const updatedAttendees = prev.attendees.map((attendee: any) => {
        if (attendee.id !== id) return attendee;

        const newAttendeeData = { ...attendee, [name]: value };

        if (name === "employeeNumber") {
          const searchValue = String(value).trim();

          console.log(
            `🔎 Buscando empleado: '${searchValue}' | Total en catálogo: ${employees?.length || 0}`,
          );

          const match = employees?.find(
            (emp) => String(emp.employeeNumber).trim() === searchValue,
          );

          if (match) {
            console.log("✅ Empleado encontrado:", match);

            newAttendeeData.name = match.name || "";
            newAttendeeData.employeeId = match.id || null;

            if (match.line) {
              const empLineText = String(match.line).trim().toLowerCase();

              const lineObj = lines?.find((l: any) => {
                const catName1 = l.name
                  ? String(l.name).trim().toLowerCase()
                  : "";
                const catName2 = l.lineName
                  ? String(l.lineName).trim().toLowerCase()
                  : "";

                return catName1 === empLineText || catName2 === empLineText;
              });

              if (lineObj) {
                newAttendeeData.lineId = lineObj.id;
                newAttendeeData.line =
                  lineObj.name || lineObj.name || String(match.line);
              } else {
                newAttendeeData.lineId = null;
                newAttendeeData.line = String(match.line);
              }
            } else {
              newAttendeeData.line = "";
              newAttendeeData.lineId = null;
            }
          } else {
            newAttendeeData.name = "";
            newAttendeeData.line = "";
            newAttendeeData.lineId = null;
            newAttendeeData.employeeId = null;
          }
        }

        return newAttendeeData;
      });
      return { ...prev, attendees: updatedAttendees };
    });
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: CreateTrainingReportPayload = {
      trainingType: formData.trainingType,
      leaderName: formData.leaderName,
      leaderPayroll: formData.leaderNomina,
      weekNumber: formData.weekNumber,
      observations: formData.observations,
      instructorSignature: formData.instructorSignature,
      coordinatorSignature: formData.coordinatorSignature,
      securitySignature: formData.safetySignature,
      unionTypes: [],
      attendees: formData.attendees.map((a: any) => {
        const topicMatch = topics.find((t) => t.topicCode === a.topicCode);

        return {
          employeeId: a.employeeId
            ? Number(a.employeeId)
            : Number(a.employeeNumber),
          lineId: a.lineId ? Number(a.lineId) : 0,
          dayMonday: a.dayMonday,
          dayTuesday: a.dayTuesday,
          dayWednesday: a.dayWednesday,
          dayThursday: a.dayThursday,
          dayFriday: a.dayFriday,
          daySaturday: a.daySaturday,
          daySunday: a.daySunday,
          customerClient: a.customerClient,
          unionClassification: a.unionClassification,
          weldingPercentage: a.weldingPercentage,
          diameter: a.diameter,
          shift: a.shift,
          machinery: a.machinery,
          ast: a.ast,
          topicIds: topicMatch?.id ? [Number(topicMatch.id)] : [],
          traineeSignature: a.traineeSignature,
          supervisorSignature: a.supervisorSignature,
        };
      }),
    };

    const success = await createReport(payload);

    if (success) {
      navigate("/reportes-entrenamientos");
    }
  };

  const isStep1Complete =
    formData.trainingType &&
    formData.attendees.length > 0 &&
    formData.attendees.every((a: any) => a.employeeNumber && a.topicCode);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-slate-800">
            {step === 1
              ? "Nuevo Reporte de Entrenamiento"
              : "Registro de Asistencia y Evidencias"}
          </h1>
        </div>

        <div className="flex gap-2 text-sm font-bold">
          <span className={step === 1 ? "text-blue-600" : "text-slate-400"}>
            1. Selección
          </span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? "text-blue-600" : "text-slate-400"}>
            2. Evaluación
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <GeneralInfoCard
              formData={formData}
              onChange={handleMasterChange}
              onTypeSelect={handleTypeSelect}
            />
            <AttendeeSelectionCard
              trainingType={formData.trainingType}
              attendees={formData.attendees}
              topicOptions={topicOptions}
              onAdd={addAttendeeRow}
              onRemove={removeAttendeeRow}
              onChange={handleAttendeeChange}
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/reportes-entrenamientos")}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 
                hover:bg-slate-100 rounded-lg transition-colors hover:cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Complete}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 
                hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex 
                items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed 
                hover:cursor-pointer"
              >
                Continuar a Evaluación <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <AttendeesSection
              trainingType={formData.trainingType}
              attendees={formData.attendees}
              topics={availableTopics}
              onRemove={removeAttendeeRow}
              onChange={handleAttendeeChange}
              onSignatureChange={handleAttendeeFileChange}
              observations={formData.observations}
              instructorSignature={formData.instructorSignature}
              coordinatorSignature={formData.coordinatorSignature}
              safetySignature={formData.safetySignature}
              onGlobalFieldChange={handleGlobalFieldChange}
            />

            <div className="flex justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 
                hover:bg-slate-100 rounded-lg transition-colors hover:cursor-pointer 
                flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft size={18} /> Volver a Selección
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg 
                    shadow-sm transition-all flex items-center gap-2 hover:cursor-pointer ${
                      isSubmitting
                        ? "bg-slate-500 cursor-not-allowed"
                        : "bg-slate-800 hover:bg-slate-900 active:scale-95"
                    }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Guardar Reporte Final
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
