import { useState } from "react";

const LINEAS_MESA = [
  "L-1",
  "L-2",
  "L-3",
  "L-4",
  "L-6",
  "L-7",
  "L-8",
  "L-9",
  "L-10",
  "L-11",
  "L-12",
  "L-14",
  "L-16",
  "L-17",
  "L-18",
];

interface TopicDef {
  day: string;
  name: string;
}

interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  line: string;
}

interface EnrolledRow {
  id: string; // ID único para la fila
  employee: Employee | null; // Null si apenas se está buscando/creando
  enrollments: boolean[];
}

// Mock de base de datos de empleados de MESA
const MOCK_DB: Employee[] = [
  {
    id: "e1",
    employeeNumber: "7021",
    name: "Yoshio Asael Estudillo Gonzalez",
    line: "L-02",
  },
  {
    id: "e2",
    employeeNumber: "7025",
    name: "Dora Nelly Martinez Flores",
    line: "L-12",
  },
  {
    id: "e3",
    employeeNumber: "7030",
    name: "Victor Benito de la Cruz",
    line: "L-14",
  },
  {
    id: "e4",
    employeeNumber: "7045",
    name: "Jorge Adrian Rojero Ysassi",
    line: "L-12",
  },
];

const mockTopics: TopicDef[] = [
  { day: "Lunes", name: "Seguridad" },
  { day: "Martes", name: "Medio Amb." },
  { day: "Miércoles", name: "5S" },
];

const EnrollmentRow = ({
  row,
  onUpdateEmployee,
  onToggleEnrollment,
  onRemoveRow,
}: {
  row: EnrolledRow;
  topics: TopicDef[];
  onUpdateEmployee: (rowId: string, employee: Employee) => void;
  onToggleEnrollment: (rowId: string, topicIndex: number) => void;
  onRemoveRow: (rowId: string) => void;
}) => {
  const [mode, setMode] = useState<"view" | "search" | "register">(
    row.employee ? "view" : "search",
  );
  const [searchQuery, setSearchQuery] = useState(row.employee?.name || "");
  const [showDropdown, setShowDropdown] = useState(false);

  const [newNomina, setNewNomina] = useState("");
  const [newLinea, setNewLinea] = useState("");

  const searchResults = MOCK_DB.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectExisting = (emp: Employee) => {
    setSearchQuery(emp.name);
    setShowDropdown(false);
    setMode("view");
    onUpdateEmployee(row.id, emp);
  };

  const handleSaveNew = () => {
    if (!searchQuery || !newNomina || !newLinea) return;

    const newEmp: Employee = {
      id: `new-${Date.now()}`,
      employeeNumber: newNomina,
      name: searchQuery,
      line: newLinea,
    };

    setMode("view");
    onUpdateEmployee(row.id, newEmp);
  };

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors bg-white">
      <td className="px-4 py-3 border-r border-slate-200 w-28">
        {mode === "register" ? (
          <input
            type="text"
            value={newNomina}
            onChange={(e) => setNewNomina(e.target.value)}
            placeholder="Nómina"
            className="w-full p-1.5 border border-blue-400 rounded text-sm 
            focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="font-mono text-slate-500">
            {row.employee?.employeeNumber || "---"}
          </span>
        )}
      </td>

      <td className="px-4 py-3 border-r border-slate-200 relative min-w-62.5">
        {mode === "view" ? (
          <span className="font-medium text-slate-900">
            {row.employee?.name}
          </span>
        ) : (
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar por nombre..."
              className={`w-full p-1.5 border ${
                mode === "register"
                  ? "border-slate-200 bg-slate-50"
                  : "border-blue-400"
              } 
                rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={mode === "register"}
            />

            {showDropdown && mode === "search" && (
              <div
                className="absolute z-10 w-full mt-1 bg-white border border-slate-300 
                rounded shadow-lg max-h-48 overflow-y-auto"
              >
                {searchResults.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => handleSelectExisting(emp)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm 
                    border-b border-slate-100"
                  >
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-xs text-slate-500">
                      Nómina: {emp.employeeNumber} | {emp.line}
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    setShowDropdown(false);
                    setMode("register");
                  }}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 cursor-pointer 
                  text-sm text-blue-600 font-semibold flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Registrar "{searchQuery || "Nuevo"}"
                </div>
              </div>
            )}
          </div>
        )}
      </td>

      <td className="px-4 py-3 border-r border-slate-200 w-32">
        {mode === "register" ? (
          <select
            value={newLinea}
            onChange={(e) => setNewLinea(e.target.value)}
            className="w-full p-1.5 border border-blue-400 rounded text-sm 
            focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>
              Línea...
            </option>
            {LINEAS_MESA.map((linea) => (
              <option key={linea} value={linea}>
                {linea}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-slate-600 text-sm">
            {row.employee?.line || "---"}
          </span>
        )}
      </td>

      {row.enrollments.map((isEnrolled, topicIndex) => (
        <td
          key={topicIndex}
          className="px-2 py-3 border-r border-slate-200 text-center"
        >
          <input
            type="checkbox"
            checked={isEnrolled}
            onChange={() => onToggleEnrollment(row.id, topicIndex)}
            disabled={!row.employee && mode !== "view"}
            className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded 
            cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          />
        </td>
      ))}

      <td className="px-4 py-3 text-center">
        {mode === "register" ? (
          <button
            onClick={handleSaveNew}
            className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold rounded 
            hover:bg-emerald-200 transition-colors hover:cursor-pointer"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => onRemoveRow(row.id)}
            className="text-slate-400 hover:text-rose-500 transition-colors 
            hover:cursor-pointer"
            title="Eliminar fila"
          >
            <svg
              className="w-5 h-5 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
};

export const EnrollmentMatrix = () => {
  const [rows, setRows] = useState<EnrolledRow[]>([]);

  const addNewEmptyRow = () => {
    const newRow: EnrolledRow = {
      id: `row-${Date.now()}`,
      employee: null,
      enrollments: Array(mockTopics.length).fill(true),
    };
    setRows([...rows, newRow]);
  };

  const handleUpdateEmployee = (rowId: string, employee: Employee) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, employee } : r)),
    );
  };

  const handleToggleEnrollment = (rowId: string, topicIndex: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const newEnrollments = [...r.enrollments];
          newEnrollments[topicIndex] = !newEnrollments[topicIndex];
          return { ...r, enrollments: newEnrollments };
        }
        return r;
      }),
    );
  };

  const handleRemoveRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Asignación de Participantes
          </h1>
          <p className="text-slate-500 mt-1">
            Busca o registra operadores en línea para este evento.
          </p>
        </div>
        <button
          onClick={addNewEmptyRow}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm 
          font-semibold rounded hover:bg-slate-800 transition-colors shadow-sm
          hover:cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar Participante
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 text-xs font-semibold uppercase">
              <tr>
                <th className="px-4 py-3 border-b border-r border-slate-200">
                  Nómina
                </th>
                <th className="px-4 py-3 border-b border-r border-slate-200">
                  Nombre del Empleado
                </th>
                <th className="px-4 py-3 border-b border-r border-slate-200">
                  Línea
                </th>
                {mockTopics.map((topic, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-2 border-b border-r border-slate-200 text-center w-24"
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
                <th className="px-4 py-3 border-b border-slate-200 text-center w-20">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5 + mockTopics.length}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    No hay participantes. Haz clic en "Agregar Participante"
                    para comenzar.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <EnrollmentRow
                    key={row.id}
                    row={row}
                    topics={mockTopics}
                    onUpdateEmployee={handleUpdateEmployee}
                    onToggleEnrollment={handleToggleEnrollment}
                    onRemoveRow={handleRemoveRow}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
