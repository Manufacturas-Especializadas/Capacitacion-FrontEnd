import { useState } from "react";
import type {
  CreateEmployee,
  Employee,
  ProductionLines,
} from "../../types/Types";
import type { EnrolledRow } from "../../hooks/useEnrollment";

interface EnrollmentRowProps {
  row: EnrolledRow;
  topicsCount: number;
  productionLines: ProductionLines[];
  employeeDb: Employee[];
  onUpdateEmployee: (rowId: string, employee: Employee) => void;
  onToggleEnrollment: (rowId: string, topicIndex: number) => void;
  onRemoveRow: (rowId: string) => void;
  onCreateEmployee: (data: CreateEmployee) => Promise<Employee | null>;
}

export const EnrollmentRow = ({
  row,
  topicsCount,
  productionLines,
  employeeDb,
  onUpdateEmployee,
  onToggleEnrollment,
  onRemoveRow,
  onCreateEmployee,
}: EnrollmentRowProps) => {
  const [mode, setMode] = useState<"view" | "search" | "register">(
    row.employee ? "view" : "search",
  );
  const [searchQuery, setSearchQuery] = useState(row.employee?.name || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [newNomina, setNewNomina] = useState("");
  const [newLinea, setNewLinea] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const searchResults = employeeDb.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectExisting = (emp: Employee) => {
    setSearchQuery(emp.name);
    setShowDropdown(false);
    setMode("view");
    onUpdateEmployee(row.id, emp);
  };

  const handleSaveNew = async () => {
    if (!searchQuery || !newNomina || !newLinea) return;

    setIsSaving(true);

    const payload: CreateEmployee = {
      employeeNumber: newNomina,
      name: searchQuery,
      productionLineId: Number(newLinea),
    };

    const newEmp = await onCreateEmployee(payload);

    if (newEmp) {
      setMode("view");
      onUpdateEmployee(row.id, newEmp);
    }

    setIsSaving(false);
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
            className="w-full p-1.5 border border-blue-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
            disabled={isSaving}
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
              } rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
              disabled={mode === "register" || isSaving}
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
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b 
                    border-slate-100"
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
            className="w-full p-1.5 border border-blue-400 rounded text-sm focus:outline-none 
            focus:ring-1 focus:ring-blue-500 bg-white"
            disabled={isSaving}
          >
            <option value="" disabled>
              Línea...
            </option>
            {productionLines.map((linea: any) => {
              const id = linea.id || linea.lineId;
              const nombre = linea.name || linea.lineName;

              return (
                <option key={id} value={id}>
                  {nombre}
                </option>
              );
            })}
          </select>
        ) : (
          <span className="text-slate-600 text-sm">
            {row.employee?.line || "---"}
          </span>
        )}
      </td>

      {Array.from({ length: topicsCount }).map((_, topicIndex) => (
        <td
          key={topicIndex}
          className="px-2 py-3 border-r border-slate-200 text-center"
        >
          <input
            type="checkbox"
            checked={row.enrollments[topicIndex] || false}
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
            className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold 
            rounded hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Guardar
          </button>
        ) : (
          <button
            onClick={() => onRemoveRow(row.id)}
            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Eliminar fila"
          >
            Eliminar
          </button>
        )}
      </td>
    </tr>
  );
};
