import { useAttendanceGrid } from "../../hooks/useAttendanceGrid";
import type {
  TrainingEventData,
  Employee,
  AttendanceRecord,
  TopicEvaluation,
} from "../../types/Types";

const TopicCell = ({
  evaluation,
  onToggleStatus,
  onChangeGrade,
}: {
  evaluation: TopicEvaluation;
  onToggleStatus: () => void;
  onChangeGrade: (val: number | "") => void;
}) => {
  const getStatusConfig = () => {
    switch (evaluation.status) {
      case "PRESENT":
        return {
          style: "bg-emerald-100 text-emerald-700 font-black",
          icon: "•",
        };
      case "ABSENT":
        return { style: "bg-rose-100 text-rose-700 font-bold", icon: "X" };
      case "TARDY":
        return { style: "bg-amber-100 text-amber-700 font-bold", icon: "R" };
      default:
        return { style: "bg-slate-50 text-transparent", icon: "-" };
    }
  };

  const config = getStatusConfig();

  return (
    <td className="p-1 border border-slate-300 min-w-22.5">
      <div className="flex items-center h-12 gap-1">
        <button
          onClick={onToggleStatus}
          className={`flex-1 h-full rounded flex items-center justify-center text-xl 
            transition-colors active:scale-95 ${config.style}`}
        >
          {config.icon}
        </button>
        <input
          type="number"
          min="0"
          max="100"
          value={evaluation.grade}
          onChange={(e) => {
            const val = e.target.value;
            onChangeGrade(val === "" ? "" : Number(val));
          }}
          placeholder="-"
          className="flex-1 h-full w-full rounded bg-white border border-slate-200 
          text-center text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 
          focus:ring-blue-500 appearance-none"
        />
      </div>
    </td>
  );
};

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
  const { records, toggleAttendance, updateGrade, comments, setComments } =
    useAttendanceGrid(initialAttendance);

  return (
    <div
      className="w-full max-w-375 mx-auto p-6 bg-white rounded-xl shadow-sm 
      border border-slate-200"
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
                  className="p-2 border-b border-r last:border-r-0 border-slate-300 text-center 
                  truncate px-2"
                  colSpan={1}
                  title={topic}
                >
                  {topic || `Tema ${idx + 1}`}
                </th>
              ))}
            </tr>
            <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider">
              {eventData.evaluationTopics.map((_, idx) => (
                <th
                  key={`sub-${idx}`}
                  className="p-1 border-b border-r last:border-r-0 border-slate-300 text-center 
                  font-normal"
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
                <tr
                  key={emp.id}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td
                    className="p-2 border-r border-slate-300 text-center font-medium 
                    text-slate-500"
                  >
                    {index + 1}
                  </td>
                  <td className="p-2 border-r border-slate-300 font-mono text-slate-600 text-xs">
                    {emp.employeeNumber}
                  </td>
                  <td
                    className="p-2 border-r border-slate-300 font-medium text-slate-900 
                    truncate"
                    title={emp.name}
                  >
                    {emp.name}
                  </td>

                  {record.evaluations.map((evaluation, topicIndex) => (
                    <TopicCell
                      key={`${emp.id}-topic-${topicIndex}`}
                      evaluation={evaluation}
                      onToggleStatus={() =>
                        toggleAttendance(emp.id, topicIndex)
                      }
                      onChangeGrade={(val) =>
                        updateGrade(emp.id, topicIndex, val)
                      }
                    />
                  ))}
                </tr>
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
          Comentarios
        </label>
        <textarea
          id="event-comments"
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-4 rounded-md border border-slate-300 bg-white text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y transition-shadow"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
          rounded-lg shadow-sm transition-colors active:scale-95 hover:cursor-pointer"
        >
          Guardar registro
        </button>
      </div>
    </div>
  );
};
