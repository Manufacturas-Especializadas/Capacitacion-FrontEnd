import { useEffect } from "react";
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import { useEnrollment } from "../../hooks/useEnrollment";
import { useCatalogs } from "../../hooks/useCatalogs";
import { useEmployees } from "../../hooks/useEmployees";
import { EnrollmentRow } from "./EnrollmentRow";

export const EnrollmentMatrix = () => {
  const { state } =
    useLocation();

  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id?: string;
    }>();

  const routeEventId =
    Number(id);

  const hasRouteEventId =
    Number.isInteger(routeEventId) &&
    routeEventId > 0;

  const stateEventId =
    Number(state?.eventId);

  const eventId =
    hasRouteEventId
      ? routeEventId
      : Number.isInteger(stateEventId) &&
        stateEventId > 0
        ? stateEventId
        : undefined;

  const isEditMode =
    hasRouteEventId;

  const expectedAttendees =
    Number(
      state?.expectedAttendees || 1,
    );

  const { lines, fetchLines } = useCatalogs();

  const { employees, isLoadingEmployees, createNewEmployee } = useEmployees();

  const {
    topics,
    rows,
    isLoadingEvent,
    isAssing,
    addEmptyRow,
    updateEmployee,
    toggleEnrollment,
    removeRow,
    saveAssignments,
  } = useEnrollment(eventId, expectedAttendees, isEditMode,);

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  if (isLoadingEvent || isLoadingEmployees) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium mt-20">
        <div className="animate-pulse">Cargando datos de asignación...</div>
      </div>
    );
  }

  const validRowsCount = rows.filter((r) => r.employee).length;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen font-sans">
      <div className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode
              ? "Editar Participantes"
              : "Asignación de Participantes"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode
              ? `Modifica los participantes del evento #${eventId}.`
              : `Busca o registra operadores para el evento #${eventId}.`}
          </p>
        </div>
        <button
          onClick={addEmptyRow}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm 
          font-semibold rounded hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
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
                {topics.map((topic: any, idx: number) => {
                  const topicName =
                    typeof topic === "object"
                      ? topic.name || topic.topicName
                      : topic;

                  return (
                    <th
                      key={idx}
                      className="px-2 py-2 border-b border-r border-slate-200 text-center w-24"
                    >
                      <span className="truncate w-full block" title={topicName}>
                        {topicName}
                      </span>
                    </th>
                  );
                })}
                <th className="px-4 py-3 border-b border-slate-200 text-center w-20">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4 + topics.length}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    No hay participantes en la lista.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <EnrollmentRow
                    key={row.id}
                    row={row}
                    topicsCount={topics.length}
                    productionLines={lines}
                    employeeDb={employees}
                    onCreateEmployee={createNewEmployee}
                    onUpdateEmployee={updateEmployee}
                    onToggleEnrollment={toggleEnrollment}
                    onRemoveRow={removeRow}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {isEditMode && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/registro-asistencia/ejecucion/${eventId}`,
              )
            }
            disabled={isAssing}
            className="
      px-6 py-3
      border border-slate-300
      bg-white text-slate-700
      font-semibold rounded-lg
      hover:bg-slate-50
      transition-colors
      cursor-pointer
      disabled:opacity-50
    "
          >
            Cancelar
          </button>
        )}
        <button
          onClick={saveAssignments}
          disabled={isAssing || validRowsCount === 0}
          className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all ${isAssing || validRowsCount === 0
            ? "bg-blue-400 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
            }`}
        >
          {isAssing
            ? "Guardando..."
            : isEditMode
              ? "Guardar Cambios"
              : "Guardar Asignaciones y Continuar"}
        </button>
      </div>
    </div>
  );
};
