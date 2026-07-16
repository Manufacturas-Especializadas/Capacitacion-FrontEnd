import { useState } from "react";
import { toast } from "sonner";
import { trainingReportsService } from "../api/services/TrainingReportsService";
import type { CreateTrainingReportPayload } from "../types/Types";

export const useTrainingReports = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReport = async (
    payload: CreateTrainingReportPayload,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await trainingReportsService.create(payload);
      toast.success("Reporte de entrenamiento registrado con éxito");
      return true;
    } catch (error) {
      console.error("Error al registrar el reporte:", error);
      toast.error(
        "Ocurrió un error al intentar guardar el reporte. Verifica los datos y la conexión.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createReport,
  };
};
