import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, Calendar, Clock } from "lucide-react";
import { useAttendanceGrid } from "../../hooks/useAttendanceGrid";
import { useTrainingEventMutations } from "../../hooks/useTrainingEventMutations";
import { EmployeeRow } from "./EmployeeRow";
import { SignatureModal } from "../SignatureModal/SignatureModal";
import {
  generateNoticePDF,
  calculateTopicStats,
  buildAttendanceFormData,
} from "../../utils/eventUtils";
import type {
  TrainingEventData,
  Employee,
  AttendanceRecord,
} from "../../types/Types";

interface TrainingEventProps {
  eventData: TrainingEventData;
  employees: Employee[];
  initialAttendance: AttendanceRecord[];
}

export const TrainingEventTable = ({
  eventData,
  employees,
  initialAttendance,
}: TrainingEventProps) => {
  const navigate = useNavigate();
  const { saveFinalAttendance, isSaving } = useTrainingEventMutations();
  const {
    records,
    toggleAttendance,
    updateGrade,
    setSignature,
    comments,
    setComments,
  } = useAttendanceGrid(initialAttendance);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentSignerId, setCurrentSignerId] = useState<string | null>(null);
  const [currentSignerName, setCurrentSignerName] = useState("");
  const [instructorSignature, setInstructorSignature] = useState<string | null>(
    null,
  );

  const topicStats = useMemo(
    () =>
      calculateTopicStats(
        records,
        eventData.evaluationTopics.map((t: any) =>
          typeof t === "object" ? t.name || t.topicName : t,
        ),
      ),
    [records, eventData.evaluationTopics],
  );

  const handleSaveAll = async (isFinal: boolean) => {
    const formData = buildAttendanceFormData(
      eventData,
      records,
      comments,
      isFinal,
      instructorSignature,
    );
    await saveFinalAttendance(formData as any, Number(eventData.id));
    navigate("/historial-registro-de-asistencia");
  };

  const openSignatureModal = (id: string, name: string) => {
    setCurrentSignerId(id);
    setCurrentSignerName(name);
    setModalOpen(true);
  };

  const handleSaveSignature = (signatureData: string) => {
    if (currentSignerId === "instructor") {
      setInstructorSignature(signatureData);
    } else if (currentSignerId) {
      setSignature(currentSignerId, signatureData);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full max-w-375 mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-slate-50 rounded-lg border border-slate-200 grow w-full">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Curso / Plática
            </p>
            <p className="text-sm font-medium text-slate-900">
              {eventData.courseName}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Instructor
            </p>
            <p className="text-sm font-medium text-slate-900">
              {eventData.instructor}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Área
            </p>
            <p className="text-sm font-medium text-slate-900">
              {eventData.area}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Periodo General
            </p>
            <p className="text-sm font-medium text-slate-900">
              {eventData.dateFrom} - {eventData.dateTo}
            </p>
          </div>
        </div>

        <button
          onClick={() => generateNoticePDF(eventData, employees)}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white 
          border-2 border-blue-600 text-blue-700 font-bold rounded-lg shadow-sm 
          hover:bg-blue-50 transition-colors active:scale-95 cursor-pointer"
        >
          <Printer size={18} />
          Imprimir Aviso
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-300">
        <table className="w-full text-sm text-left table-auto min-w-250">
          <thead className="bg-slate-100 text-slate-700 text-xs font-semibold">
            <tr>
              <th
                className="p-3 border-b border-r border-slate-300 w-12 text-center uppercase"
                rowSpan={2}
              >
                N°
              </th>
              <th
                className="p-3 border-b border-r border-slate-300 w-20 uppercase"
                rowSpan={2}
              >
                N° Emp
              </th>
              <th
                className="p-3 border-b border-r border-slate-300 w-48 uppercase"
                rowSpan={2}
              >
                Nombre del Empleado
              </th>
              <th
                className="p-3 border-b border-r border-slate-300 w-28 uppercase text-center"
                rowSpan={2}
              >
                Línea
              </th>

              {eventData.evaluationTopics.map((topic: any, idx) => {
                const name =
                  typeof topic === "object"
                    ? topic.name || topic.topicName
                    : topic;
                const date =
                  typeof topic === "object"
                    ? topic.date || topic.topicDate
                    : "";
                const startTime =
                  typeof topic === "object" ? topic.startTime : "";
                const endTime = typeof topic === "object" ? topic.endTime : "";

                return (
                  <th
                    key={idx}
                    className="p-3 border-b border-r border-slate-300 text-center px-4 
                    min-w-40"
                    colSpan={1}
                  >
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <span
                        className="font-bold text-slate-900 text-xs tracking-tight 
                        uppercase line-clamp-1"
                        title={name}
                      >
                        {name || `Tema ${idx + 1}`}
                      </span>

                      {date && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                          <Calendar size={11} className="text-blue-500" />
                          {date}
                        </span>
                      )}

                      {startTime && endTime && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-normal whitespace-nowrap">
                          <Clock size={10} className="text-slate-400" />
                          {startTime.substring(0, 5)} -{" "}
                          {endTime.substring(0, 5)}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              <th
                className="p-3 border-b border-slate-300 w-32 uppercase text-center"
                rowSpan={2}
              >
                Firma del Participante
              </th>
            </tr>
            <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider">
              {eventData.evaluationTopics.map((_, idx) => (
                <th
                  key={`sub-${idx}`}
                  className="p-1 border-b border-r border-slate-300 text-center font-normal"
                >
                  <div className="flex justify-between px-2">
                    <span title="Asistencia">Asis.</span>
                    <span title="Calificación">Cal.</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => {
              const record = records.find((r) => r.employeeId === emp.id);
              if (!record) return null;

              return (
                <EmployeeRow
                  key={emp.id}
                  index={index}
                  employee={emp}
                  record={record}
                  toggleAttendance={toggleAttendance}
                  updateGrade={updateGrade}
                  openSignatureModal={openSignatureModal}
                />
              );
            })}

            {employees.length > 0 && (
              <tr className="bg-slate-100/80 border-t-2 border-slate-300">
                <td
                  colSpan={4}
                  className="p-3 pr-4 border-r border-slate-300 text-right uppercase 
                  text-[10px] font-bold text-slate-700 tracking-wider"
                >
                  RESULTADOS POR TEMA:
                </td>
                {topicStats.map((stat, idx) => (
                  <td
                    key={`stat-${idx}`}
                    className="p-2 border-r border-slate-300 text-center"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span
                        className={`px-1.5 py-1 rounded text-[10px] font-bold ${stat.attendance >= 80 ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700"}`}
                        title="Asistencia del Tema"
                      >
                        {stat.attendance}%
                      </span>
                      <span
                        className={`px-1.5 py-1 rounded text-[10px] font-bold ${stat.average !== null ? (stat.average >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700") : "text-slate-400 bg-slate-50"}`}
                        title="Promedio del Tema"
                      >
                        {stat.average !== null ? stat.average : "-"}
                      </span>
                    </div>
                  </td>
                ))}
                <td className="p-3 bg-transparent"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-5 bg-slate-50 rounded-lg border border-slate-200">
        <label
          htmlFor="event-comments"
          className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3"
        >
          Comentarios / Observaciones
        </label>
        <textarea
          id="event-comments"
          rows={3}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-4 rounded-md border border-slate-300 bg-white text-sm 
          text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>

      <div
        className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 
        gap-8"
      >
        <div className="flex flex-col items-center justify-end">
          <div className="w-64 border-b border-slate-800 mb-2 h-16" />
          <p className="text-sm font-semibold text-slate-800">Irene Santiago</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">
            Coord. De Capacitación
          </p>
        </div>

        <div className="flex flex-col items-center justify-end">
          <div
            className="w-64 border-b border-slate-800 mb-2 h-16 flex items-end 
            justify-center pb-1 relative group cursor-pointer"
            onClick={() =>
              openSignatureModal("instructor", eventData.instructor)
            }
          >
            {instructorSignature ? (
              <img
                src={instructorSignature}
                alt="Firma Instructor"
                className="h-14 object-contain"
              />
            ) : (
              <span
                className="text-slate-400 text-sm mb-2 group-hover:text-blue-600 
                transition-colors"
              >
                Clic para firmar
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {eventData.instructor}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wider">
            Instructor de la sesión
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 font-semibold rounded-lg shadow-sm transition-all flex 
          hover:cursor-pointer bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700"
        >
          Regresar
        </button>
        <button
          onClick={() => handleSaveAll(false)}
          disabled={isSaving}
          className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all flex 
            items-center gap-2 ${
              isSaving
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 active:scale-95 hover:cursor-pointer"
            }`}
        >
          Guardar Progreso
        </button>

        <button
          onClick={() => {
            if (
              window.confirm(
                "¿Estás seguro de finalizar el curso? Una vez cerrado, ya no podrás hacer modificaciones a las calificaciones ni asistencias.",
              )
            ) {
              handleSaveAll(true);
            }
          }}
          disabled={isSaving}
          className={`px-8 py-3 font-semibold rounded-lg shadow-sm transition-all flex 
            items-center gap-2 ${
              isSaving
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 hover:cursor-pointer"
            }`}
        >
          {isSaving ? "Guardando..." : "Finalizar y Cerrar Curso"}
        </button>
      </div>

      <SignatureModal
        isOpen={modalOpen}
        title={currentSignerName}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
};
