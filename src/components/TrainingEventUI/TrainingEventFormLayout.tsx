import {
  useState,
  useEffect,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrainingEventMutations } from "../../hooks/useTrainingEventMutations";
import { useCatalogs } from "../../hooks/useCatalogs";
import InputField from "../Inputs/InputField";
import SelectField from "../Inputs/SelectField";
import { toast } from "sonner";
import { trainingEventService } from "../../api/services/TrainingEventService";

import type {
  CreateTrainingEvent,
  UpdateTrainingEvent,
} from "../../types/Types";

interface TopicEntry {
  id?: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const TrainingEventFormLayout = () => {
  const navigate = useNavigate();
  const { createEvent, updateEvent, isCreating, isUpdating } = useTrainingEventMutations();
  const { rooms, fetchRooms } = useCatalogs();
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const isSubmitting = isCreating || isUpdating;
  const { id } = useParams<{ id?: string; }>();

  const isEditMode = id !== undefined;

  const parsedEventId = Number(id);

  const eventId = isEditMode && Number.isInteger(parsedEventId) && parsedEventId > 0
    ? parsedEventId
    : null;

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (
      !isEditMode ||
      !eventId
    ) {
      return;
    }

    const loadEvent = async () => {
      try {
        setIsLoadingEvent(true);

        const data =
          await trainingEventService.getDetails(
            eventId,
          );

        setFormData({
          courseName:
            data.eventData.courseName,

          instructor:
            data.eventData.instructor,

          room:
            String(
              data.eventData.roomId,
            ),

          /*
           * Este dato no existe como propiedad
           * guardada en TrainingEvent.
           *
           * En edición mostramos la cantidad
           * actual de participantes.
           */
          attendeeCount:
            String(
              data.employees.length,
            ),
        });

        setTopics(
          data.eventData.evaluationTopics.map(
            (topic) => ({
              id: topic.id,

              name:
                topic.name,

              date:
                toDateInputValue(
                  topic.date,
                ),

              startTime:
                topic.startTime.substring(
                  0,
                  5,
                ),

              endTime:
                topic.endTime.substring(
                  0,
                  5,
                ),
            }),
          ),
        );
      } catch (error) {
        console.error(
          "Error cargando evento:",
          error,
        );

        toast.error(
          "No se pudo cargar el evento.",
        );
      } finally {
        setIsLoadingEvent(false);
      }
    };

    void loadEvent();
  }, [
    eventId,
    isEditMode,
  ]);

  const [formData, setFormData] = useState({
    courseName: "",
    instructor: "",
    room: "",
    attendeeCount: "",
  });

  const [topics, setTopics] = useState<TopicEntry[]>([
    { name: "", date: "", startTime: "", endTime: "" },
  ]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  type EditableTopicField =
    | "name"
    | "date"
    | "startTime"
    | "endTime";

  const handleTopicChange = (
    index: number,
    field: EditableTopicField,
    value: string,
  ) => {
    const newTopics = [...topics];

    newTopics[index][field] = value;

    setTopics(newTopics);
  };

  const addTopic = () => {
    setTopics([
      ...topics,
      {
        name: "",
        date: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const removeTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validTopics = topics.filter((t) => t.name.trim() !== "");

    for (const topic of validTopics) {
      if (!topic.date || !topic.startTime || !topic.endTime) {
        toast.error(`Faltan fechas u horas en el tema: ${topic.name}`);
        return;
      }
      if (topic.endTime <= topic.startTime) {
        toast.error(
          `La hora de fin debe ser mayor a la de inicio en: ${topic.name}`,
        );
        return;
      }
    }

    if (validTopics.length === 0) {
      toast.error("Debes agregar al menos un tema");
      return;
    }

    const sortedDates = validTopics.map((t) => t.date).sort();
    const globalDateFrom = sortedDates[0];
    const globalDateTo = sortedDates[sortedDates.length - 1];

    if (
      isEditMode &&
      eventId
    ) {
      const payload: UpdateTrainingEvent =
      {
        courseName:
          formData.courseName,

        instructorName:
          formData.instructor,

        roomId:
          Number(formData.room),

        dateFrom:
          `${globalDateFrom}T00:00:00`,

        dateTo:
          `${globalDateTo}T23:59:59`,

        evaluationTopics:
          validTopics.map(
            (topic) => ({
              id: topic.id,

              name:
                topic.name,

              date:
                `${topic.date}T00:00:00`,

              startTime:
                `${topic.startTime}:00`,

              endTime:
                `${topic.endTime}:00`,
            }),
          ),
      };

      const success =
        await updateEvent(
          eventId,
          payload,
        );

      if (success) {
        /*
         * Vamos después a EnrollmentMatrix
         * porque si se agregó un tema nuevo,
         * debemos decidir qué participantes
         * estarán inscritos en él.
         */
        navigate(
          `/registro-asistencia/usuarios/${eventId}`,
        );
      }

      return;
    }

    const payload: CreateTrainingEvent =
    {
      courseName:
        formData.courseName,

      instructorName:
        formData.instructor,

      roomId:
        Number(formData.room),

      dateFrom:
        `${globalDateFrom}T00:00:00`,

      dateTo:
        `${globalDateTo}T23:59:59`,

      evaluationTopics:
        validTopics.map(
          (topic) => ({
            name:
              topic.name,

            date:
              `${topic.date}T00:00:00`,

            startTime:
              `${topic.startTime}:00`,

            endTime:
              `${topic.endTime}:00`,
          }),
        ),
    };

    const newEventId =
      await createEvent(payload);

    if (newEventId) {
      navigate(
        "/registro-asistencia/usuarios",
        {
          state: {
            eventId:
              newEventId,

            expectedAttendees:
              formData.attendeeCount,
          },
        },
      );
    }
  };

  const roomOptions = [
    { value: "", label: "Selecciona una sala..." },
    ...rooms.map((room) => ({
      value: room.id,
      label: room.name,
    })),
  ];

  const toDateInputValue = (
    value: string,
  ): string => {
    if (!value) {
      return "";
    }

    const parts =
      value.split("-");

    if (
      parts.length === 3 &&
      parts[0].length === 2 &&
      parts[1].length === 2 &&
      parts[2].length === 4
    ) {
      const [day, month, year] =
        parts;

      return `${year}-${month}-${day}`;
    }

    return value.slice(0, 10);
  };

  if (
    isEditMode &&
    isLoadingEvent
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
        Cargando datos del evento...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 min-h-screen font-sans">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-blue-600 flex items-center 
          gap-2 mb-4 transition-colors font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={20} />
          Volver al Historial
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {isEditMode
            ? "Editar control de asistencia"
            : "Configurar nueva lista de asistencia"}
        </h1>

        <p className="text-slate-500 mt-1">
          {isEditMode
            ? "Modifica los datos generales, temas y horarios del evento."
            : "Completa los detalles para generar la tabla de asistencia y evaluación"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-8 space-y-8">
          <div>
            <h2
              className="text-lg font-semibold text-slate-800 mb-6 border-b 
              border-slate-100 pb-2"
            >
              Datos Generales de la Sesión
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-1 md:col-span-2">
                <InputField
                  label="Nombre del Curso / Capacitación"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-span-1">
                <InputField
                  label="Nombre del Instructor"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-span-1">
                <SelectField
                  label="Sala de Capacitación"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  options={roomOptions}
                  required
                />
              </div>
              <div className="col-span-1">
                <InputField
                  type="number"
                  label={
                    isEditMode
                      ? "Participantes Actuales"
                      : "Cantidad de Asistentes Esperados"
                  }
                  name="attendeeCount"
                  min="1"
                  value={formData.attendeeCount}
                  onChange={handleInputChange}
                  disabled={isEditMode}
                  required={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Temas y Horarios
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Agrega los temas y horarios necesarios para la sesión.
              </p>
            </div>

            <div className="space-y-4">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative 
                  group"
                >
                  <div className="grid grid-cols-12 gap-4">
                    {/* Fila superior: Nombre del tema */}
                    <div className="col-span-12">
                      <InputField
                        label={`Tema ${index + 1}`}
                        value={topic.name}
                        onChange={(e) =>
                          handleTopicChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <InputField
                        type="date"
                        label="Fecha"
                        value={topic.date}
                        onChange={(e) =>
                          handleTopicChange(index, "date", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <InputField
                        type="time"
                        label="Hora Inicio"
                        value={topic.startTime}
                        onChange={(e) =>
                          handleTopicChange(index, "startTime", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <InputField
                        type="time"
                        label="Hora Fin"
                        value={topic.endTime}
                        onChange={(e) =>
                          handleTopicChange(index, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="absolute -top-3 -right-3 bg-white p-2 border border-slate-200 
                      text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full 
                      transition-all shadow-sm cursor-pointer"
                      title="Eliminar tema"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>


            <button
              type="button"
              onClick={addTopic}
              className="mt-4 flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Plus size={18} className="mr-2" /> Agregar otro tema y horario
            </button>

          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              isEditMode && eventId
                ? navigate(
                  `/registro-asistencia/ejecucion/${eventId}`,
                )
                : navigate(-1)
            }
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${isSubmitting
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
              }`}
          >
            {isSubmitting
              ? "Guardando..."
              : isEditMode
                ? "Guardar Cambios"
                : "Generar Tabla de Asistencia"}
          </button>
        </div>
      </form>
    </div>
  );
};
