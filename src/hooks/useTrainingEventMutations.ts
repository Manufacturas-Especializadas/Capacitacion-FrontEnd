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

  const createEvent = async (data: CreateTrainingEvent) => {
    setIsAssigning(true);
    try {
      await trainingEventService.createEvent(data);
      toast.success("Evento de capacitación registrado");
      return true;
    } catch (err) {
      console.error("Error creating event: ", err);
      toast.error("Ocurrio un error al crear el evento. Intenta de nuevo");
      return false;
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

  const saveFinalAttendance = async (data: SaveAttendance) => {
    setIsSaving(true);

    toast.promise(trainingEventService.saveAttendance(data), {
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

  return {
    createEvent,
    assignAttendees,
    saveFinalAttendance,
    isCreating,
    isAssing,
    isSaving,
  };
};
