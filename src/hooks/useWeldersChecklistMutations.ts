import { useState } from "react";
import type { WelderEvaluations } from "../types/Types";
import { toast } from "sonner";
import { weldersChecklistService } from "../api/services/WeldersChecklistService";

export const useWeldersChecklistMutations = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveEvaluation = async (
    payload: WelderEvaluations,
  ): Promise<boolean> => {
    setIsSaving(true);

    const toastId = toast.loading("Guardando evaluación, subiendo archivos...");

    try {
      const evaluationId = await weldersChecklistService.create(payload);

      toast.success(`Evaluación #${evaluationId} guardad exitosamente`, {
        id: toastId,
      });

      return true;
    } catch (error: any) {
      console.error("Error al guardar la evalación de soldadura: ", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrio un error de conexión al guardar la evaluación";

      toast.error(errorMessage, { id: toastId });

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateEvaluation = async (
    id: number,
    payload: WelderEvaluations,
  ): Promise<boolean> => {
    setIsSaving(true);
    const toastId = toast.loading("Actualizando evaluación...");

    try {
      await weldersChecklistService.update(id, payload);
      toast.success(`Evaluación ${id} actualizada correctamente`, {
        id: toastId,
      });

      return true;
    } catch (error: any) {
      console.error("Error al actualizar la evalaución: ", error);
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al actualizar";
      toast.error(errorMessage, { id: toastId });

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveEvaluation,
    updateEvaluation,
    isSaving,
  };
};
