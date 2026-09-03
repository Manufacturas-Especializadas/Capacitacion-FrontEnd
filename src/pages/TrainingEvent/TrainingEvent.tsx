import { useState, useEffect } from "react";
import { useNavigate, useParams, } from "react-router-dom";
import { Users, Pencil } from "lucide-react";
import { TrainingEventTable } from "../../components/TrainingEventUI/TrainingEventTable";
import type {
  TrainingEventData,
  Employee,
  AttendanceRecord,
} from "../../types/Types";
import { trainingEventService } from "../../api/services/TrainingEventService";


interface EventDetailsResponse {
  eventData: TrainingEventData;
  employees: Employee[];
  initialAttendance: AttendanceRecord[];
}

export const TrainingEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<EventDetailsResponse | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await trainingEventService.getDetails(Number(id));
        setDetails(data as unknown as EventDetailsResponse);
      } catch (error) {
        console.error("Error al cargar la lista de asistencia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8 bg-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-slate-500 font-medium text-lg animate-pulse">
          Preparando lista de asistencia...
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-8 bg-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-rose-500 font-medium text-lg bg-white p-6 rounded-lg shadow-sm border border-rose-100">
          No se pudo cargar la información del evento #{id}.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">


      <div className="mb-4 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/registro-asistencia/editar/${id}`,
            )
          }
          className="
      flex items-center gap-2
      rounded-lg
      border border-slate-300
      bg-white
      px-4 py-2.5
      text-sm font-semibold
      text-slate-700
      shadow-sm
      transition-colors
      hover:bg-slate-50
      hover:text-blue-600
      cursor-pointer
    "
        >
          <Pencil size={18} />
          Editar datos del evento
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/registro-asistencia/usuarios/${id}`,
            )
          }
          className="
      flex items-center gap-2
      rounded-lg
      border border-slate-300
      bg-white
      px-4 py-2.5
      text-sm font-semibold
      text-slate-700
      shadow-sm
      transition-colors
      hover:bg-slate-50
      hover:text-blue-600
      cursor-pointer
    "
        >
          <Users size={18} />
          Editar participantes
        </button>
      </div>
      <TrainingEventTable
        eventData={details.eventData}
        employees={details.employees}
        initialAttendance={details.initialAttendance}
      />
    </div>
  );
};
