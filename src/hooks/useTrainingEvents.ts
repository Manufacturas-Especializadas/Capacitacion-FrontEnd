import { useState, useEffect, useCallback } from "react";
import { trainingEventService } from "../api/services/TrainingEventService";
import type { TrainingEvents } from "../types/Types";
import { toast } from "sonner";

export const useTrainingEvents = () => {
  const [events, setEvents] = useState<TrainingEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await trainingEventService.getTrainingEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error al obtener el historial de eventos:", err);
      toast.error("No se pudo cargar el historial de capacitaciones.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};
