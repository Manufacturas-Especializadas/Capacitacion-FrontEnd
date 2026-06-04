import { useReactToPrint } from "react-to-print";
import type { Employee, TrainingEventData } from "../../types/Types";
import { useRef } from "react";

interface Props {
  eventData: TrainingEventData;
  employees: Employee[];
}

export const NoticeDocument = ({ eventData, employees }: Props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Aviso_${eventData.courseName.replace(/\s+/g, "_")}`,
  });

  return (
    <div>
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
        transition-colors"
      >
        Descargar Aviso PDF
      </button>

      <div className="absolute -left-2499.75 top-0">
        <div
          ref={componentRef}
          className="w-[210mm] min-h-[297mm] p-10 bg-white text-slate-900 font-sans"
        >
          <h1 className="text-2xl font-bold mb-1">
            Aviso de Convocatoria a Capacitación
          </h1>
          <p className="text-slate-500 mb-6">
            Manufacturas Especializadas, S.A. (MESA)
          </p>

          <div className="mb-8 text-base">
            <p>
              <strong>Curso / Plática:</strong> {eventData.courseName}
            </p>
            <p>
              <strong>Instructor:</strong> {eventData.instructor}
            </p>
            <p>
              <strong>Fechas:</strong> {eventData.dateFrom} al{" "}
              {eventData.dateTo}
            </p>
          </div>

          {/* Tabla */}
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-slate-300 px-3 py-2 w-10 text-center">
                  N°
                </th>
                <th className="border border-slate-300 px-3 py-2 w-24 text-center">
                  N° Nómina
                </th>
                <th className="border border-slate-300 px-3 py-2 text-left">
                  Nombre del Operador
                </th>
                <th className="border border-slate-300 px-3 py-2 w-32 text-center">
                  Línea
                </th>
                <th className="border border-slate-300 px-3 py-2 w-40 text-left">
                  Firma de Enterado
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr
                  key={emp.employeeNumber}
                  className="border-b border-slate-300"
                >
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    {emp.employeeNumber}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {emp.name}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    {emp.line}
                  </td>
                  <td className="border border-slate-300 px-3 py-2 h-10"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
