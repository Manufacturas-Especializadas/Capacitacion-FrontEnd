import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockHistory = [
  {
    id: "evt-003",
    topic: "Inducción General y Calidad",
    instructor: "Ing. Roberto Sánchez",
    date: "2026-05-25",
    status: "Completado",
    attendees: 15,
  },
  {
    id: "evt-004",
    topic: "Manejo de Montacargas",
    instructor: "Lic. Mariana Gómez",
    date: "2026-05-26",
    status: "Borrador",
    attendees: 8,
  },
  {
    id: "evt-005",
    topic: "Actualización Norma ISO 9001",
    instructor: "Ing. Roberto Sánchez",
    date: "2026-05-28",
    status: "Programado",
    attendees: 22,
  },
];

export const TrainingHistoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-emerald-100 text-emerald-700";
      case "Programado":
        return "bg-blue-100 text-blue-700";
      case "Borrador":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 min-h-screen font-sans">
      <div
        className="flex flex-col sm:flex-row justify-between items-start 
        sm:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Capacitación MESA
          </h1>
          <p className="text-slate-500 mt-1">
            Historial y gestión de eventos de entrenamiento
          </p>
        </div>

        <button
          onClick={() => navigate("/registro-asistencia")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
          text-white font-semibold rounded-lg shadow-sm transition-all active:scale-95
          hover:cursor-pointer"
        >
          <PlusCircle size={20} />
          Registrar Nuevo Evento
        </button>
      </div>

      <div
        className="bg-white p-4 rounded-t-xl border border-slate-200 border-b-0 
          flex flex-col sm:flex-row justify-between gap-4"
      >
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            placeholder="Buscar por tema o instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm 
            text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Completado">Completado</option>
            <option value="Programado">Programado</option>
            <option value="Borrador">Borrador</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className="bg-slate-50 text-slate-600 uppercase text-xs font-semibold 
              border-b border-slate-200"
            >
              <tr>
                <th className="px-6 py-4">ID Evento</th>
                <th className="px-6 py-4">Tema / Curso</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4 text-center">Asistentes</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockHistory.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {event.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {event.topic}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {event.instructor}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{event.date}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="inline-flex items-center justify-center bg-slate-100 
                      text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {event.attendees}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs 
                        font-semibold ${getStatusBadge(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {event.status === "Completado"
                        ? "Ver Detalles"
                        : "Continuar"}
                    </button>
                  </td>
                </tr>
              ))}
              {mockHistory.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No se encontraron eventos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
