import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { trainingReportsService } from "../api/services/TrainingReportsService";
import type {
  CreateTrainingReportPayload,
  TrainingReportDetails,
  TrainingReportSummary,
  UpdateTrainingReportPayload,
} from "../types/Types";

interface UseTrainingReportsResult {
  reports: TrainingReportSummary[];
  isLoadingReports: boolean;
  reportsError: string | null;
  isSubmitting: boolean;
  deletingReportId: number | null;
  fetchReports: () => Promise<void>;
  createReport: (
    payload: CreateTrainingReportPayload,
  ) => Promise<boolean>;
  deleteReport: (reportId: number) => Promise<boolean>;
  updateReport: (
    reportId: number,
    payload: UpdateTrainingReportPayload,
  ) => Promise<boolean>;
}

interface UseTrainingReportDetailsResult {
  report: TrainingReportDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrainingReports = (): UseTrainingReportsResult => {
  const [reports, setReports] = useState<TrainingReportSummary[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingReportId, setDeletingReportId] =
    useState<number | null>(null);

  const fetchReports = useCallback(async (): Promise<void> => {
    setIsLoadingReports(true);
    setReportsError(null);

    try {
      const data = await trainingReportsService.getAll();

      if (!Array.isArray(data)) {
        throw new Error(
          "La respuesta del servidor no contiene una lista de reportes.",
        );
      }

      setReports(data);
    } catch (error) {
      console.error("Error al cargar los reportes:", error);

      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los reportes.";

      setReports([]);
      setReportsError(message);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  const createReport = useCallback(
    async (
      payload: CreateTrainingReportPayload,
    ): Promise<boolean> => {
      setIsSubmitting(true);

      try {
        await trainingReportsService.create(payload);

        toast.success(
          "Reporte de entrenamiento registrado con éxito",
        );

        return true;
      } catch (error) {
        console.error("Error al registrar el reporte:", error);

        const message =
          error instanceof Error
            ? error.message
            : "Ocurrió un error al intentar guardar el reporte.";

        toast.error(message);

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const deleteReport = useCallback(
    async (reportId: number): Promise<boolean> => {
      if (!Number.isInteger(reportId) || reportId <= 0) {
        toast.error(
          "El identificador del reporte no es válido.",
        );

        return false;
      }

      setDeletingReportId(reportId);

      try {
        const response =
          await trainingReportsService.delete(reportId);
        setReports((currentReports) =>
          currentReports.filter(
            (report) => report.id !== reportId,
          ),
        );

        toast.success(
          response.message ||
          "Reporte de entrenamiento eliminado correctamente.",
        );

        return true;
      } catch (error) {
        console.error(
          `Error al eliminar el reporte ${reportId}:`,
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el reporte de entrenamiento.";

        toast.error(message);

        return false;
      } finally {
        setDeletingReportId(null);
      }
    },
    [],
  );

  const updateReport = useCallback(
    async (
      reportId: number,
      payload: UpdateTrainingReportPayload,
    ): Promise<boolean> => {
      if (
        !Number.isInteger(reportId) ||
        reportId <= 0
      ) {
        toast.error(
          "El identificador del reporte no es válido.",
        );

        return false;
      }

      setIsSubmitting(true);

      try {
        const response =
          await trainingReportsService.update(
            reportId,
            payload,
          );

        toast.success(
          response.message ||
          "Reporte de entrenamiento actualizado correctamente.",
        );

        return true;
      } catch (error) {
        console.error(
          `Error al actualizar el reporte ${reportId}:`,
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el reporte.";

        toast.error(message);

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return {
    reports,
    isLoadingReports,
    reportsError,
    isSubmitting,
    deletingReportId,
    fetchReports,
    createReport,
    deleteReport,
    updateReport,
  };
};

export const useTrainingReportDetails = (
  reportId: number | null,
  enabled = true,
): UseTrainingReportDetailsResult => {
  const [report, setReport] =
    useState<TrainingReportDetails | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (): Promise<void> => {
    if (!enabled) {
      setReport(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (
      reportId === null ||
      !Number.isInteger(reportId) ||
      reportId <= 0
    ) {
      setReport(null);
      setError("El identificador del reporte no es válido.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data =
        await trainingReportsService.getById(reportId);

      setReport(data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar el reporte.";

      setReport(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [reportId, enabled]);

  useEffect(() => {
    void fetchReport();
  }, [fetchReport]);

  return {
    report,
    isLoading,
    error,
    refetch: fetchReport,
  };
};

