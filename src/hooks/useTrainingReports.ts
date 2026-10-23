import { useCallback, useEffect, useRef, useState } from "react";
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
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  search: string;
  trainingType: string;
  weekNumber: number | null;
  setPage: (value: number) => void;
  setSearch: (value: string) => void;
  setTrainingType: (value: string) => void;
  setWeekNumber: (value: number | null) => void;
  fetchReports: () => void;
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

// The form also uses this hook; only the listing opts into automatic loading.
export const useTrainingReports = (enabled = false): UseTrainingReportsResult => {
  const [reports, setReports] = useState<TrainingReportSummary[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(enabled);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingReportId, setDeletingReportId] =
    useState<number | null>(null);

  const [page, setPageValue] = useState(1);
  const pageSize = 25;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [trainingType, setTrainingTypeValue] = useState("");
  const [weekNumber, setWeekNumberValue] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const normalizedSearch = search.trim();

  useEffect(() => {
    if (normalizedSearch === debouncedSearch) return;
    const timer = window.setTimeout(() => setDebouncedSearch(normalizedSearch), 400);
    return () => window.clearTimeout(timer);
  }, [normalizedSearch, debouncedSearch]);

  useEffect(() => {
    if ((!enabled && refreshCount === 0) || normalizedSearch !== debouncedSearch) return;

    const controller = new AbortController();
    activeRequest.current = controller;

    const loadReports = async () => {
      try {
        const data = await trainingReportsService.getAll(
          { page, pageSize, search: debouncedSearch, trainingType, weekNumber },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        if (!Array.isArray(data.items)) {
          throw new Error("La respuesta del servidor no contiene una lista de reportes.");
        }

        const lastPage = Math.max(1, data.totalPages);
        if (page > lastPage) {
          setPageValue(lastPage);
          return;
        }

        setReports(data.items);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setIsLoadingReports(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Error al cargar los reportes:", error);
        setReports([]);
        setReportsError(error instanceof Error ? error.message : "No se pudieron cargar los reportes.");
        setIsLoadingReports(false);
      }
    };

    void loadReports();
    return () => controller.abort();
  }, [enabled, page, pageSize, normalizedSearch, debouncedSearch, trainingType, weekNumber, refreshCount]);

  const prepareRequest = useCallback(() => {
    activeRequest.current?.abort();
    setIsLoadingReports(true);
    setReportsError(null);
  }, []);

  const setPage = (value: number) => {
    if (!Number.isInteger(value)) return;
    const nextPage = Math.max(1, Math.min(value, Math.max(1, totalPages)));
    if (nextPage === page) return;
    prepareRequest();
    setPageValue(nextPage);
  };

  const setSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === normalizedSearch) return;
    prepareRequest();
    setPageValue(1);
  };

  const setTrainingType = (value: string) => {
    if (value === trainingType) return;
    prepareRequest();
    setTrainingTypeValue(value);
    setPageValue(1);
  };

  const setWeekNumber = (value: number | null) => {
    if (value !== null && (!Number.isInteger(value) || value < 1 || value > 53)) return;
    if (value === weekNumber) return;
    prepareRequest();
    setWeekNumberValue(value);
    setPageValue(1);
  };

  const fetchReports = useCallback(() => {
    prepareRequest();
    setRefreshCount((count) => count + 1);
  }, [prepareRequest]);

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
        fetchReports();

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
    [fetchReports],
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
    page,
    pageSize,
    totalCount,
    totalPages,
    search,
    trainingType,
    weekNumber,
    setPage,
    setSearch,
    setTrainingType,
    setWeekNumber,
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

