import {
  PlusCircle,
  Search,
  Calendar,
  CalendarDays,
  BookOpen,
  Users,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrainingEvents } from "../../hooks/useTrainingEvents";
import { useTrainingEventMutations } from "../../hooks/useTrainingEventMutations";

export const TrainingHistoryDashboard = () => {
  const navigate = useNavigate();
  const {
    events,
    isLoading,
    error,
    page,
    totalCount,
    totalPages,
    search,
    statusFilter,
    setPage,
    setSearch,
    setStatusFilter,
    refetch,
  } = useTrainingEvents();
  const { deleteEvent, isDeleting } = useTrainingEventMutations();

  const getStatusBadgeStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETADO":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "EN_PROGRESO":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "PROGRAMADO":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "BORRADOR":
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este evento? Esta acción borrará a todos los participantes asignados y no se puede deshacer.",
      )
    ) {
      const success = await deleteEvent(id);
      if (success) {
        refetch();
      }
    }
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen font-sans 
      text-slate-900"
    >
      <div
        className="flex flex-col md:flex-row justify-between items-start 
        md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Control de Capacitación
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-0.5">
            Historial, métricas y gestión de entrenamientos de personal.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 bg-white text-slate-500 hover:text-blue-600 
            hover:bg-blue-50 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <button
          onClick={() => navigate("/registro-asistencia")}
          className="w-full md:w-auto flex items-center justify-center gap-2 
          px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold 
          rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle size={18} />
          Registrar Sesión
        </button>
      </div>

      <div
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm 
        flex flex-col sm:flex-row justify-between gap-4 mb-6"
      >
        <div className="relative w-full sm:w-96">
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 
            pointer-events-none text-slate-400"
          >
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar por curso o instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 
            rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 
            focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="text-slate-400 hidden sm:block">
            <SlidersHorizontal size={16} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 border border-slate-200 bg-slate-50 rounded-lg 
            px-3 py-2.5 text-sm text-slate-600 focus:bg-white focus:outline-none 
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer 
            transition-all"
          >
            <option value="">Todos los estados</option>
            <option value="PROGRAMADO">Programado</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="COMPLETADO">Completado</option>
            <option value="BORRADOR">Borrador</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div role="status" className="p-12 flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">
            Cargando el historial de capacitaciones...
          </p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-md mx-auto">
          <p className="text-rose-700 font-semibold mb-2">Ocurrió un error</p>
          <p className="text-rose-600 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : events.length === 0 ? (
        <div
          className="bg-white border border-slate-200 rounded-xl p-12 text-center 
          shadow-sm"
        >
          <p className="text-slate-400 font-medium text-base">
            No se encontraron registros que coincidan con los criterios de
            búsqueda.
          </p>
        </div>
      ) : (
        <>
          <div
            className="hidden md:block bg-white border border-slate-200 rounded-xl 
            overflow-x-auto shadow-sm"
          >
            <table className="w-full text-sm text-left border-collapse">
              <thead
                className="bg-slate-50 text-slate-500 uppercase text-[11px] 
                font-bold tracking-wider border-b border-slate-200"
              >
                <tr>
                  <th className="px-6 py-4 w-24">ID</th>
                  <th className="px-6 py-4">Curso / Plática</th>
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4 w-44">Periodo</th>
                  <th className="px-6 py-4 text-center w-28">Semana</th>
                  <th className="px-6 py-4 text-center w-28">Temas</th>
                  <th className="px-6 py-4 text-center w-28">Personal</th>
                  <th className="px-6 py-4 w-36">Estado</th>
                  <th className="px-6 py-4 text-center w-28">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{event.id}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">
                      {event.courseName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {event.instructorName}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {event.dateFrom} al {event.dateTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center gap-1 bg-slate-100
                        text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold"
                      >
                        <CalendarDays size={12} className="text-slate-500" />
                        {event.weekNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center gap-1 bg-slate-100
                        text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold"
                      >
                        <BookOpen size={12} className="text-slate-500" />
                        {event.topicCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center gap-1 bg-slate-100 
                        text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold"
                      >
                        <Users size={12} className="text-slate-500" />
                        {event.attendeeCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs 
                          font-bold uppercase tracking-wide ${getStatusBadgeStyles(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {event.status?.toUpperCase() === "COMPLETADO" ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/registro-asistencia/ejecucion/${event.id}`,
                              )
                            }
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                            title="Ver Detalles"
                          >
                            <Eye size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(
                                `/registro-asistencia/ejecucion/${event.id}`,
                              )
                            }
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg 
                            hover:bg-blue-50 transition-all cursor-pointer"
                            title="Continuar Registro"
                          >
                            <ArrowRight size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={isDeleting}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 
                          rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          title="Eliminar Evento"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm 
                flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs text-slate-400">
                    #{event.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] 
                      font-bold uppercase tracking-wide ${getStatusBadgeStyles(event.status)}`}
                  >
                    {event.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {event.courseName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructor: {event.instructorName}
                  </p>
                </div>

                <div
                  className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-slate-100 
                  text-xs text-slate-500 font-medium"
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span>
                      {event.dateFrom} / {event.dateTo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays size={14} className="text-slate-400" />
                    <span>Semana {event.weekNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-slate-400" />
                    <span>{event.topicCount} Temas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-slate-400" />
                    <span>{event.attendeeCount} Operadores</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/registro-asistencia/ejecucion/${event.id}`)
                  }
                  className={`w-full mt-2 py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    event.status?.toUpperCase() === "COMPLETADO"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {event.status?.toUpperCase() === "COMPLETADO" ? (
                    <>
                      <Eye size={14} /> Ver detalles
                    </>
                  ) : (
                    <>
                      Continuar Evaluación <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoading && !error && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <p>{totalCount} registros en total</p>
          <nav aria-label="Paginación del historial" className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isDeleting}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="font-medium">
              {totalPages > 0 ? `Página ${page} de ${totalPages}` : "Sin resultados"}
            </span>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || isDeleting}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
