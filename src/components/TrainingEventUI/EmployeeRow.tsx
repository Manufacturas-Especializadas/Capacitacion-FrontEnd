import type { Employee, AttendanceRecord } from "../../types/Types";
import { TopicCell } from "./TopicCell";

interface EmployeeRowProps {
  index: number;
  employee: Employee;
  record: AttendanceRecord;
  toggleAttendance: (empId: string, topicIndex: number) => void;
  updateGrade: (empId: string, topicIndex: number, val: number | "") => void;
  openSignatureModal: (id: string, name: string) => void;
}
export const EmployeeRow = ({
  index,
  employee,
  record,
  toggleAttendance,
  updateGrade,
  openSignatureModal,
}: EmployeeRowProps) => {
  const totalTopics = record.evaluations.length;
  const presentCount = record.evaluations.filter(
    (e) => e.status === "PRESENT",
  ).length;
  const attendancePercentage =
    totalTopics > 0 ? Math.round((presentCount / totalTopics) * 100) : 0;

  const validGrades = record.evaluations
    .map((e) => Number(e.grade))
    .filter((g) => g !== null && !isNaN(g) && g > 0);

  const gradeAverage =
    validGrades.length > 0
      ? Math.round(validGrades.reduce((a, b) => a + b, 0) / validGrades.length)
      : null;

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="p-2 border-r border-slate-300 text-center font-medium text-slate-500">
        {index + 1}
      </td>
      <td className="p-2 border-r border-slate-300 font-mono text-slate-600 text-xs">
        {employee.employeeNumber}
      </td>
      <td
        className="p-2 border-r border-slate-300 font-medium text-slate-900 truncate"
        title={employee.name}
      >
        {employee.name}
      </td>

      {record.evaluations.map((evaluation, topicIndex) => (
        <TopicCell
          key={`${employee.id}-topic-${topicIndex}`}
          evaluation={evaluation}
          onToggleStatus={() => toggleAttendance(employee.id, topicIndex)}
          onChangeGrade={(val) => updateGrade(employee.id, topicIndex, val)}
        />
      ))}

      <td className="p-2 border-r border-slate-300 text-center font-bold">
        <span
          className={`px-2 py-1 rounded text-xs ${
            attendancePercentage >= 80
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {attendancePercentage}%
        </span>
      </td>

      <td className="p-2 border-r border-slate-300 text-center font-bold">
        {gradeAverage !== null ? (
          <span
            className={`px-2 py-1 rounded text-xs ${
              gradeAverage >= 80
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-rose-700"
            }`}
          >
            {gradeAverage}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>

      <td className="p-2 border-slate-300 border-l text-center">
        {record.signature && record.signature.trim() !== "" ? (
          <div className="relative group flex justify-center">
            <img
              src={record.signature}
              alt="Firma"
              className="h-10 object-contain"
            />
            <button
              onClick={() => openSignatureModal(employee.id, employee.name)}
              className="absolute inset-0 bg-black/60 text-white text-[10px] uppercase 
              font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity 
              flex items-center justify-center rounded cursor-pointer"
            >
              Re-firmar
            </button>
          </div>
        ) : (
          <button
            onClick={() => openSignatureModal(employee.id, employee.name)}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold 
            rounded border border-slate-300 hover:bg-slate-200 hover:cursor-pointer 
            transition-colors w-full"
          >
            Firmar
          </button>
        )}
      </td>
    </tr>
  );
};
