import { useState } from "react";
import { useAttendanceGrid } from "../../hooks/useAttendanceGrid";
import { useTrainingEventMutations } from "../../hooks/useTrainingEventMutations";
import { EmployeeRow } from "./EmployeeRow";
import { SignatureModal } from "../SignatureModal/SignatureModal";
import type {
  TrainingEventData,
  Employee,
  AttendanceRecord,
} from "../../types/Types";
import { useNavigate } from "react-router-dom";

interface TrainingEventProps {
  eventData: TrainingEventData;
  employees: Employee[];
  initialAttendance: AttendanceRecord[];
}

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const TrainingEventTable = ({
  eventData,
  employees,
  initialAttendance,
}: TrainingEventProps) => {
  const {
    records,
    toggleAttendance,
    updateGrade,
    setSignature,
    comments,
    setComments,
  } = useAttendanceGrid(initialAttendance);

  const { saveFinalAttendance, isSaving } = useTrainingEventMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentSignerId, setCurrentSignerId] = useState<string | null>(null);
  const [currentSignerName, setCurrentSignerName] = useState("");
  const [instructorSignature, setInstructorSignature] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

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

  const handleSaveAll = async () => {
    const formData = new FormData();

    formData.append("EventId", eventData.id.toString());
    formData.append("Comments", comments || "");

    if (instructorSignature) {
      const file = dataURLtoFile(
        instructorSignature,
        "instructor_signature.png",
      );
      formData.append("InstructorSignature", file);
    }

    records.forEach((record, index) => {
      formData.append(
        `EmployeeRecords[${index}].EmployeeId`,
        record.employeeId.toString(),
      );

      if (record.signature && record.signature.trim() !== "") {
        const empFile = dataURLtoFile(
          record.signature,
          `emp_${record.employeeId}_signature.png`,
        );
        formData.append(`EmployeeRecords[${index}].Signature`, empFile);
      }

      record.evaluations.forEach((ev, evIndex) => {
        formData.append(
          `EmployeeRecords[${index}].Evaluations[${evIndex}].Status`,
          ev.status,
        );
        if (ev.grade !== "" && ev.grade !== null) {
          formData.append(
            `EmployeeRecords[${index}].Evaluations[${evIndex}].Grade`,
            ev.grade.toString(),
          );
        }
      });
    });

    await saveFinalAttendance(formData as any, Number(eventData.id));

    navigate("/");
  };

  return (
    <div
      className="w-full max-w-375 mx-auto p-6 bg-white rounded-xl shadow-sm border 
      border-slate-200"
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-slate-50 
        rounded-lg border border-slate-200"
      >
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
          <p className="text-sm font-medium text-slate-900">{eventData.area}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Fechas
          </p>
          <p className="text-sm font-medium text-slate-900">
            {eventData.dateFrom} - {eventData.dateTo}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-300">
        <table className="w-full text-sm text-left table-fixed min-w-250">
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
              {eventData.evaluationTopics.map((topic, idx) => (
                <th
                  key={idx}
                  className="p-2 border-b border-r last:border-r-0 border-slate-300 
                  text-center truncate px-2"
                  colSpan={1}
                  title={topic}
                >
                  {topic || `Tema ${idx + 1}`}
                </th>
              ))}
              <th
                className="p-3 border-b border-slate-300 border-l w-32 uppercase text-center"
                rowSpan={2}
              >
                Firma del Participante
              </th>
            </tr>
            <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider">
              {eventData.evaluationTopics.map((_, idx) => (
                <th
                  key={`sub-${idx}`}
                  className="p-1 border-b border-r last:border-r-0 border-slate-300 text-center font-normal"
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

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className={`px-8 py-3 font-semibold rounded-lg shadow-sm transition-all flex 
            items-center gap-2 ${
              isSaving
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 hover:cursor-pointer"
            }`}
        >
          {isSaving ? "Guardando Registro..." : "Guardar Registro Final"}
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
