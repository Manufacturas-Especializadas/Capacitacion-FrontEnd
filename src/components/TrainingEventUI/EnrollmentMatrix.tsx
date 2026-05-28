import { useState } from "react";

interface TopicDef {
  day: string;
  name: string;
}

interface EnrolledEmployee {
  id: string;
  employeeNumber: string;
  name: string;
  line: string;
  enrollments: boolean[];
}

const mockTopics: TopicDef[] = [
  { day: "Lunes", name: "Seguridad" },
  { day: "Martes", name: "Medio Ambiente" },
  { day: "Miércoles", name: "5S" },
  { day: "Jueves", name: "Calidad" },
  { day: "Viernes", name: "Evaluación" },
];

export const EnrollmentMatrix = () => {
  const [employees, setEmployees] = useState<EnrolledEmployee[]>([
    {
      id: "emp-1",
      employeeNumber: "7021",
      name: "Yoshio Asaet Estudiilo G.",
      line: "L-02",
      enrollments: [true, true, true, true, true],
    },
    {
      id: "emp-2",
      employeeNumber: "7025",
      name: "Dora Nelly Martinez Flores",
      line: "L-12",
      enrollments: [true, true, true, true, true],
    },
  ]);

  const [searchInput, setSearchInput] = useState("");

  const handleAddEmployee = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      const newEmp: EnrolledEmployee = {
        id: `emp-${Date.now()}`,
        employeeNumber: Math.floor(1000 + Math.random() * 9000).toString(),
        name: searchInput,
        line: "Por definir",
        enrollments: Array(mockTopics.length).fill(true),
      };
      setEmployees([...employees, newEmp]);
      setSearchInput("");
    }
  };

  const toggleEnrollment = (empId: string, topicIndex: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          const newEnrollments = [...emp.enrollments];
          newEnrollments[topicIndex] = !newEnrollments[topicIndex];
          return { ...emp, enrollments: newEnrollments };
        }
        return emp;
      }),
    );
  };

  const toggleAllForEmployee = (empId: string, currentState: boolean) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === empId) {
          return {
            ...emp,
            enrollments: Array(mockTopics.length).fill(!currentState),
          };
        }
        return emp;
      }),
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen font-sans">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Matriz de Asignación de Personal
        </h1>
        <p className="text-slate-500 mt-1">
          Busca a los operadores y selecciona a qué días/temas deben asistir.
        </p>
      </div>

      <div
        className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 
        flex items-center gap-4"
      >
        <div className="relative grow max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleAddEmployee}
            placeholder="Buscar empleado por nombre o nómina (Presiona Enter para agregar)"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <span className="text-sm font-medium text-slate-500">
          Total en lista:{" "}
          <span className="text-blue-600 font-bold">{employees.length}</span>
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 border-b border-r border-slate-200 w-16">
                  Nómina
                </th>
                <th className="px-4 py-3 border-b border-r border-slate-200 min-w-50">
                  Nombre del Empleado
                </th>

                {mockTopics.map((topic, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-2 border-b border-r last:border-r-0 border-slate-200 
                    text-center w-28"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 mb-1">
                        {topic.day}
                      </span>
                      <span
                        className="truncate w-full block"
                        title={topic.name}
                      >
                        {topic.name}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 border-b border-slate-200 text-center w-24">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((emp) => {
                const isAllEnrolled = emp.enrollments.every(Boolean);

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td
                      className="px-4 py-3 border-r border-slate-200 font-mono 
                      text-slate-500"
                    >
                      {emp.employeeNumber}
                    </td>
                    <td
                      className="px-4 py-3 border-r border-slate-200 font-medium 
                      text-slate-900"
                    >
                      {emp.name}
                    </td>

                    {emp.enrollments.map((isEnrolled, topicIndex) => (
                      <td
                        key={topicIndex}
                        className="px-2 py-3 border-r last:border-r-0 border-slate-200 
                        text-center bg-white"
                      >
                        <label
                          className="flex items-center justify-center w-full h-full 
                        cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isEnrolled}
                            onChange={() =>
                              toggleEnrollment(emp.id, topicIndex)
                            }
                            className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 
                            rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </label>
                      </td>
                    ))}

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          toggleAllForEmployee(emp.id, isAllEnrolled)
                        }
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          isAllEnrolled
                            ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        {isAllEnrolled ? "Limpiar" : "Todos"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
          rounded-lg shadow-sm transition-colors active:scale-95 flex items-center gap-2
          hover:cursor-pointer"
          onClick={() =>
            console.log("Matriz final para el backend:", employees)
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Finalizar y Crear Evento
        </button>
      </div>
    </div>
  );
};
