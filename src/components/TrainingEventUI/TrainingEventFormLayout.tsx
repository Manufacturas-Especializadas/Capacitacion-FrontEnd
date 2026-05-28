import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TrainingEventFormLayout = () => {
  const [formData, setFormData] = useState({
    instructor: "",
    room: "",
    startTime: "",
    endTime: "",
    attendeeCount: "",
  });

  const navigate = useNavigate();

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
    if (topics.length < 6) {
      setTopics([...topics, ""]);
    }
  };

  const removeTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate("/registro-asistencia/usuarios");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 min-h-screen font-sans">
      <div className="mb-8">
        <button
          className="text-slate-500 hover:text-blue-600 flex items-center 
          gap-2 mb-4 transition-colors font-medium text-sm hover:cursor-pointer"
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
              className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 
              pb-2"
            >
              Datos de la Sesión
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label
                  className="block text-xs font-bold text-slate-600 uppercase tracking-wider 
                  mb-2"
                >
                  Nombre del Instructor
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Ej. Ing. Roberto Sánchez"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 
                  focus:ring-blue-500 focus:border-blue-500 outline-none transition-all 
                  text-slate-700"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold text-slate-600 uppercase 
                  tracking-wider mb-2"
                >
                  Sala de Capacitación
                </label>
                <div className="relative">
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 
                    focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none 
                    bg-white text-slate-700"
                    required
                  >
                    <option value="" disabled>
                      Selecciona una sala...
                    </option>
                    <option value="Sala CCA">Sala CCA</option>
                    <option value="Sala de acuerdos">Sala de Acuerdos</option>
                    <option value="Sala aluminio">Sala Aluminio</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Cantidad de Asistentes
                </label>
                <input
                  type="number"
                  name="attendeeCount"
                  min="1"
                  value={formData.attendeeCount}
                  onChange={handleInputChange}
                  placeholder="Ej. 15"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                  required
                />
              </div>

              {/* Horario */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-2">
              <h2 className="text-lg font-semibold text-slate-800">
                Temas a Impartir / Evaluar
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Máximo 6 columnas
              </span>
            </div>

            <div className="space-y-3">
              {topics.map((topic, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="grow">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      placeholder={`Ej. Tema ${index + 1}`}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                      required
                    />
                  </div>
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

            {topics.length < 6 && (
              <button
                type="button"
                onClick={addTopic}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
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
            className="px-6 py-3 bg-white border border-slate-300 text-slate-700 
            font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm 
            hover:bg-blue-700 transition-colors active:scale-95"
          >
            Generar Tabla de Asistencia
          </button>
        </div>
      </form>
    </div>
  );
};
