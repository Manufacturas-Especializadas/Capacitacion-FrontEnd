import {
  useState,
  useEffect,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { ArrowLeft } from "lucide-react";
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

  const [topics, setTopics] = useState<string[]>([""]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    if (topics.length < 5) {
      setTopics([...topics, ""]);
    } else {
      toast.error("Solo se permite un máximo de 5 temas por sesión", {
        id: "max-topics-toast",
      });
    }
  };

  const removeTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validTopics = topics.filter((t) => t.trim() !== "");

    if (validTopics.length > 5) {
      toast.error("No puedes enviar más de 5 temas");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    const payload = {
      courseName: formData.courseName,
      instructorName: formData.instructor,
      roomId: Number(formData.room),
      dateFrom: `${formData.startDate}T${formData.startTime}:00`,
      dateTo: `${formData.endDate}T${formData.endTime}:00`,
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
              Datos de la Sesión
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-1 md:col-span-2">
                <InputField
                  label="Curso / Plática"
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
                  type="date"
                  label="Fecha de Inicio"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <InputField
                  type="date"
                  label="Fecha de Término"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  required
                />
              </div>

              <div className="col-span-1">
                <InputField
                  type="time"
                  label="Hora de Inicio"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1">
                <InputField
                  type="time"
                  label="Hora de Término"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-1 md:col-span-2 pt-2">
                <div className="md:w-1/2 md:pr-3">
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
          </div>

          <div>
            <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Temas a Impartir / Evaluar
              </h2>
              <span
                className="text-xs font-medium text-slate-500 bg-slate-100 px-2 
                py-1 rounded"
              >
                Máximo 5 columnas
              </span>
            </div>

            <div className="space-y-2">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="grow">
                    <InputField
                      label={`Tema ${index + 1}`}
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      required
                    />
                  </div>
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="p-3 mt-1 text-slate-400 hover:text-rose-500 
                      hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar tema"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {topics.length < 5 && (
              <button
                type="button"
                onClick={addTopic}
                className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-600 
                hover:text-blue-800 transition-colors cursor-pointer"
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
                Agregar otro tema
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 
            font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-all 
              flex items-center gap-2 ${
                isCreating
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95 cursor-pointer"
              }`}
          >
            {isCreating ? "Generando..." : "Generar Tabla de Asistencia"}
          </button>
        </div>
      </form>
    </div>
  );
};
