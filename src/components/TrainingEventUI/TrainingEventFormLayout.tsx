import {
  useState,
  useEffect,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrainingEventMutations } from "../../hooks/useTrainingEventMutations";
import { useCatalogs } from "../../hooks/useCatalogs";
import InputField from "../Inputs/InputField";
import SelectField from "../Inputs/SelectField";
import { toast } from "sonner";

interface TopicEntry {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
}

export const TrainingEventFormLayout = () => {
  const navigate = useNavigate();
  const { createEvent, isCreating } = useTrainingEventMutations();
  const { rooms, fetchRooms } = useCatalogs();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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

  const handleTopicChange = (
    index: number,
    field: keyof TopicEntry,
    value: string,
  ) => {
    const newTopics = [...topics];
    newTopics[index][field] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    if (topics.length < 5) {
      setTopics([
        ...topics,
        { name: "", date: "", startTime: "", endTime: "" },
      ]);
    } else {
      toast.error("Solo se permite un máximo de 5 temas por sesión", {
        id: "max-topics",
      });
    }
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

    if (validTopics.length > 5) return;

    const sortedDates = validTopics.map((t) => t.date).sort();
    const globalDateFrom = sortedDates[0];
    const globalDateTo = sortedDates[sortedDates.length - 1];

    const payload = {
      courseName: formData.courseName,
      instructorName: formData.instructor,
      roomId: Number(formData.room),
      dateFrom: `${globalDateFrom}T00:00:00`,
      dateTo: `${globalDateTo}T23:59:59`,
      evaluationTopics: validTopics,
    };

    const eventId = await createEvent(payload as any);

    if (eventId) {
      navigate("/registro-asistencia/usuarios", {
        state: {
          eventId,
          expectedAttendees: formData.attendeeCount,
        },
      });
    }
  };

  const roomOptions = [
    { value: "", label: "Selecciona una sala..." },
    ...rooms.map((room) => ({
      value: room.id,
      label: room.name,
    })),
  ];

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
          Configurar nueva lista de asistencia
        </h1>
        <p className="text-slate-500 mt-1">
          Completa los detalles para generar la tabla de asistencia y evaluación
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
                  label="Cantidad de Asistentes Esperados"
                  name="attendeeCount"
                  min="1"
                  value={formData.attendeeCount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Temas y Horarios
              </h2>
              <span
                className="text-xs font-medium text-slate-500 bg-slate-100 px-2 
                py-1 rounded"
              >
                Máximo 5 temas
              </span>
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

            {topics.length < 5 && (
              <button
                type="button"
                onClick={addTopic}
                className="mt-4 flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Plus size={18} className="mr-2" /> Agregar otro tema y horario
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 ${isCreating ? "bg-blue-400 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"}`}
          >
            {isCreating ? "Generando..." : "Generar Tabla de Asistencia"}
          </button>
        </div>
      </form>
    </div>
  );
};
