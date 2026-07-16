import { Users, Plus, Trash } from "lucide-react";
import type { ChangeEvent } from "react";

interface AttendeeSelectionCardProps {
  trainingType: string;
  attendees: any[];
  topicOptions: { value: string; label: string }[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const AttendeeSelectionCard = ({
  trainingType,
  attendees,
  topicOptions,
  onAdd,
  onRemove,
  onChange,
}: AttendeeSelectionCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Users size={20} className="text-blue-500" />
          Asistentes al Entrenamiento
        </h2>
        <button
          type="button"
          onClick={onAdd}
          disabled={!trainingType}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 px-4 
          rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 
          disabled:cursor-not-allowed hover:cursor-pointer"
        >
          <Plus size={16} />
          Agregar Asistente
        </button>
      </div>

      {!trainingType && (
        <div
          className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-4 border 
          border-amber-200"
        >
          Por favor, selecciona un "Tipo de Entrenamiento" arriba para poder
          asignar temas a los asistentes.
        </div>
      )}

      {attendees.length === 0 && trainingType ? (
        <div
          className="text-center py-8 text-slate-400 border-2 border-dashed 
          border-slate-200 rounded-lg"
        >
          No hay asistentes agregados. Haz clic en "Agregar Asistente".
        </div>
      ) : (
        <div className="space-y-3">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border 
              border-slate-100 group"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Nómina
                  </label>
                  <input
                    type="text"
                    name="employeeNumber"
                    value={attendee.employeeNumber}
                    onChange={(e) => onChange(attendee.id, e)}
                    className="border border-slate-200 rounded-md px-2 py-1.5 text-sm 
                    focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="Buscar..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={attendee.name}
                    onChange={(e) => onChange(attendee.id, e)}
                    className="border border-slate-200 rounded-md px-2 py-1.5 text-sm 
                    bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Línea
                  </label>
                  <input
                    type="text"
                    name="line"
                    value={attendee.line}
                    onChange={(e) => onChange(attendee.id, e)}
                    className="border border-slate-200 rounded-md px-2 py-1.5 text-sm 
                    bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500">
                    Tema Asignado
                  </label>
                  <select
                    name="topicCode"
                    value={attendee.topicCode}
                    onChange={(e) => onChange(attendee.id, e)}
                    className="border border-slate-200 rounded-md px-2 py-1.5 text-sm 
                    bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="" disabled>
                      Seleccione un tema...
                    </option>
                    {topicOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(attendee.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 
                rounded-md transition-colors mt-5 hover:cursor-pointer"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
