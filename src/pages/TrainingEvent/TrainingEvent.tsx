import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      <TrainingEventTable
        eventData={details.eventData}
        employees={details.employees}
        initialAttendance={details.initialAttendance}
      />
    </div>
  );
};
