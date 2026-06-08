import { useState } from "react";
import type {
  AssignAttendees,
  CreateTrainingEvent,
  SaveAttendance,
} from "../types/Types";
import { trainingEventService } from "../api/services/TrainingEventService";
import { toast } from "sonner";

export const useTrainingEventMutations = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isAssing, setIsAssigning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createEvent = async (data: CreateTrainingEvent) => {
    setIsCreating(true);
    try {
      const eventId = await trainingEventService.createEvent(data);
      toast.success("Evento de capacitación creado con éxito");
      return eventId;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Ocurrió un error al crear el evento. Intenta de nuevo.");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const assignAttendees = async (data: AssignAttendees) => {
    setIsAssigning(true);

    try {
      await trainingEventService.assignAttendees(data);
      toast.success("Participantes asignados correctamente");
      return true;
    } catch (err) {
      console.error("Error assigning attendee: ", err);
      toast.error("No se pudo procesar la asignación de participantes");
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  const saveFinalAttendance = async (data: SaveAttendance, id: number) => {
    setIsSaving(true);

    toast.promise(trainingEventService.saveAttendance(data, id), {
      loading: "Guardando registro y subiendo firmas...",
      success: () => {
        return "Registro de capacitación completado";
      },
      error: () => {
        return "Ocurrió un error al guardar la asistencia final";
      },
      finally: () => {
        setIsSaving(false);
      },
    });
  };

  const deleteEvent = async (id: number) => {
    setIsDeleting(true);
    try {
      await trainingEventService.delete(id);
      toast.success("Evento eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Ocurrió un error al eliminar el evento.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createEvent,
    assignAttendees,
    saveFinalAttendance,
    isCreating,
    isAssing,
    isSaving,
    deleteEvent,
    isDeleting,
  };
};
