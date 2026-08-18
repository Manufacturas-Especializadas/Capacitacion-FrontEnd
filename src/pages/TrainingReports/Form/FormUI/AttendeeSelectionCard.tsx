import { Users, Plus, Trash } from "lucide-react";
import type { ChangeEvent } from "react";

interface AttendeeTopicSelection {
  id: string;
  topicId: number | null;
}

interface AttendeeSelectionItem {
  id: string;
  employeeNumber: string;
  name: string;
  line: string;
  topics: AttendeeTopicSelection[];
}

interface AttendeeSelectionCardProps {
  trainingType: string;
  attendees: AttendeeSelectionItem[];
  topicOptions: { value: number; label: string }[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (
    id: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onAddTopic: (
    attendeeId: string,
  ) => void;

  onRemoveTopic: (
    attendeeId: string,
    topicRowId: string,
  ) => void;

  onTopicChange: (
    attendeeId: string,
    topicRowId: string,
    topicId: number | null,
  ) => void;
}

export const AttendeeSelectionCard = ({
  trainingType,
  attendees,
  topicOptions,
  onAdd,
  onRemove,
  onChange,
  onAddTopic,
  onRemoveTopic,
  onTopicChange,
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
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                </div>
                <div className="flex flex-col gap-1">
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Temas de aprendizaje
                        </p>

                        <p className="text-xs text-slate-400">
                          Puedes asignar varios temas al mismo asistente.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onAddTopic(attendee.id)
                        }
                        disabled={
                          attendee.topics.length >=
                          topicOptions.length
                        }
                        className="bg-white border border-blue-200 text-blue-600
      hover:bg-blue-50 font-semibold py-1.5 px-3 rounded-lg
      text-xs transition-colors flex items-center gap-1.5
      disabled:opacity-50 disabled:cursor-not-allowed
      hover:cursor-pointer"
                      >
                        <Plus size={14} />
                        Agregar tema
                      </button>
                    </div>

                    {attendee.topics.length === 0 ? (
                      <div
                        className="rounded-lg border border-dashed border-slate-200
      bg-white px-4 py-4 text-center text-xs text-slate-400"
                      >
                        Aún no hay temas asignados.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {attendee.topics.map(
                          (topicAssignment) => {
                            const selectedTopicIds =
                              attendee.topics
                                .filter(
                                  (topic) =>
                                    topic.id !==
                                    topicAssignment.id,
                                )
                                .map(
                                  (topic) =>
                                    topic.topicId,
                                )
                                .filter(
                                  (
                                    topicId,
                                  ): topicId is number =>
                                    topicId !== null,
                                );

                            return (
                              <div
                                key={topicAssignment.id}
                                className="flex items-center gap-2"
                              >
                                <select
                                  value={
                                    topicAssignment.topicId ??
                                    ""
                                  }
                                  onChange={(event) =>
                                    onTopicChange(
                                      attendee.id,
                                      topicAssignment.id,
                                      event.target.value
                                        ? Number(
                                          event.target.value,
                                        )
                                        : null,
                                    )
                                  }
                                  className="flex-1 border border-slate-200
                rounded-md px-3 py-2 text-sm bg-white
                focus:ring-1 focus:ring-blue-500
                outline-none"
                                  required
                                >
                                  <option
                                    value=""
                                    disabled
                                  >
                                    Seleccione un tema...
                                  </option>

                                  {topicOptions
                                    .filter(
                                      (option) =>
                                        option.value ===
                                        topicAssignment.topicId ||
                                        !selectedTopicIds.includes(
                                          option.value,
                                        ),
                                    )
                                    .map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onRemoveTopic(
                                      attendee.id,
                                      topicAssignment.id,
                                    )
                                  }
                                  className="p-2 text-slate-400
                hover:text-red-500 hover:bg-red-50
                rounded-md transition-colors
                hover:cursor-pointer"
                                  title="Eliminar tema"
                                >
                                  <Trash size={17} />
                                </button>
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
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
