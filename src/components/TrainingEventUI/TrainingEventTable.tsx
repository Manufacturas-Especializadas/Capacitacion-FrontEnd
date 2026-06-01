import { useState, useMemo } from "react";
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
import { Printer } from "lucide-react"; // <-- NUEVO: Ícono de impresora
import jsPDF from "jspdf"; // <-- NUEVO: Librería PDF
import autoTable from "jspdf-autotable"; // <-- NUEVO: Librería para tablas en PDF

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

  const handleSaveAll = async (isFinal: boolean) => {
    const formData = new FormData();

    formData.append("EventId", eventData.id.toString());
    formData.append("Comments", comments || "");
    formData.append("IsFinalSave", isFinal.toString());

    if (instructorSignature && instructorSignature.startsWith("data:image")) {
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

      if (
        record.signature &&
        record.signature.trim() !== "" &&
        record.signature.startsWith("data:image")
      ) {
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

        const isAbsent = ev.status === "ABSENT" || ev.status === "X";

        if (!isAbsent && ev.grade !== null && ev.grade !== null) {
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

  // --- NUEVA FUNCIÓN: GENERADOR DE AVISO EN PDF ---
  const generateNoticePDF = () => {
    const doc = new jsPDF();

    // 1. Título y Encabezado
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Aviso de Convocatoria a Capacitación", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Manufacturas Especializadas, S.A. (MESA)", 14, 28);

    // 2. Información del Curso
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Curso / Plática: ${eventData.courseName}`, 14, 40);
    doc.text(`Instructor: ${eventData.instructor}`, 14, 46);
    doc.text(`Fechas: ${eventData.dateFrom} al ${eventData.dateTo}`, 14, 52);

    // 3. Preparar los datos de la tabla
    const tableColumn = [
      "N°",
      "N° Nómina",
      "Nombre del Operador / Empleado",
      "Firma de Enterado",
    ];
    const tableRows: any[] = [];

    employees.forEach((emp, index) => {
      const rowData = [
        index + 1,
        emp.employeeNumber,
        emp.name,
        "", // Espacio en blanco para que el operador firme de enterado físicamente
      ];
      tableRows.push(rowData);
    });

    // 4. Dibujar la tabla
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }, // bg-blue-600
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 80 },
        3: { cellWidth: 50 }, // Columna ancha para la firma física
      },
    });

    // 5. Descargar el archivo
    doc.save(`Aviso_${eventData.courseName.replace(/\s+/g, "_")}.pdf`);
  };
  // ------------------------------------------------

  const topicStats = useMemo(() => {
    return eventData.evaluationTopics.map((_, topicIdx) => {
      let possible = 0;
      let actual = 0;
      let sumGrades = 0;
      let countGrades = 0;

      records.forEach((record) => {
        const evaluation = record.evaluations[topicIdx];

        if (evaluation && evaluation.status) {
          const status = evaluation.status.toUpperCase() as string;

          if (status !== "EMPTY" && status !== "PENDING") {
            possible++;
            const isPresentOrLate = [
              "PRESENT",
              "LATE",
              "TARDY",
              "R",
              "RETARDO",
            ].includes(status);
            if (isPresentOrLate) actual++;

            const isAbsent = ["ABSENT", "X", "FALTA"].includes(status);
            const grade = Number(evaluation.grade);

            if (
              !isAbsent &&
              evaluation.grade !== null &&
              evaluation.grade !== null &&
              !isNaN(grade) &&
              grade > 0
            ) {
              sumGrades += grade;
              countGrades++;
            }
          }
        }
      });

      return {
        attendance: possible > 0 ? Math.round((actual / possible) * 100) : 0,
        average: countGrades > 0 ? Math.round(sumGrades / countGrades) : null,
      };
    });
  }, [records, eventData.evaluationTopics]);

  return (
    <div
      className="w-full max-w-375 mx-auto p-6 bg-white rounded-xl shadow-sm border 
      border-slate-200"
    >
      {/* HEADER DE DATOS DEL CURSO CON BOTÓN DE IMPRESIÓN */}
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
              Fechas
            </p>
            <p className="text-sm font-medium text-slate-900">
              {eventData.dateFrom} - {eventData.dateTo}
            </p>
          </div>
        </div>

        <button
          onClick={generateNoticePDF}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-blue-600 text-blue-700 font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors active:scale-95 cursor-pointer"
          title="Descargar lista para aviso a operadores"
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

              {eventData.evaluationTopics.map((topic, idx) => (
                <th
                  key={idx}
                  className="p-2 border-b border-r border-slate-300 text-center truncate px-2"
                  colSpan={1}
                  title={topic}
                >
                  {topic || `Tema ${idx + 1}`}
                </th>
              ))}

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
                  colSpan={3}
                  className="p-3 pr-4 border-r border-slate-300 text-right uppercase text-[10px] font-bold text-slate-700 tracking-wider"
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
                        className={`px-1.5 py-1 rounded text-[10px] font-bold ${
                          stat.attendance >= 80
                            ? "bg-blue-100 text-blue-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                        title="Asistencia del Tema"
                      >
                        {stat.attendance}%
                      </span>
                      <span
                        className={`px-1.5 py-1 rounded text-[10px] font-bold ${
                          stat.average !== null
                            ? stat.average >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                            : "text-slate-400 bg-slate-50"
                        }`}
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
