import { useState, useEffect, useCallback } from "react";
import { trainingEventService } from "../api/services/TrainingEventService";
import type { TrainingEvents } from "../types/Types";
import { toast } from "sonner";

export const useTrainingEvents = () => {
  const [events, setEvents] = useState<TrainingEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageValue] = useState(1);
  const pageSize = 25;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusValue] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const normalizedSearch = search.trim();

  useEffect(() => {
    if (normalizedSearch === debouncedSearch) return;

    const timer = window.setTimeout(() => {
      setDebouncedSearch(normalizedSearch);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [normalizedSearch, debouncedSearch]);

  useEffect(() => {
    // Wait for the search debounce before requesting page 1.
    if (normalizedSearch !== debouncedSearch) return;

    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        const data = await trainingEventService.getTrainingEvents(
          { page, pageSize, search: debouncedSearch, status: statusFilter },
          controller.signal,
        );
        if (controller.signal.aborted) return;

        const lastPage = Math.max(1, data.totalPages);
        if (page > lastPage) {
          // A deletion may have removed the last page; keep loading its replacement.
          setPageValue(lastPage);
          return;
        }

        setEvents(data.items);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Error al obtener el historial de eventos:", err);
        const message = "No se pudo cargar el historial de capacitaciones.";
        setError(message);
        toast.error(message);
        setIsLoading(false);
      }
    };

    void fetchEvents();
    return () => controller.abort();
  }, [page, pageSize, normalizedSearch, debouncedSearch, statusFilter, refreshCount]);

  const setPage = (value: number) => {
    const nextPage = Math.max(1, Math.min(value, Math.max(1, totalPages)));
    if (nextPage === page) return;
    setIsLoading(true);
    setError(null);
    setPageValue(nextPage);
  };

  const setSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === normalizedSearch) return;
    setIsLoading(true);
    setError(null);
    setPageValue(1);
  };

  const setStatusFilter = (value: string) => {
    if (value === statusFilter) return;
    setIsLoading(true);
    setError(null);
    setStatusValue(value);
    setPageValue(1);
  };

  const refetch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setRefreshCount((count) => count + 1);
  }, []);

  return {
    events,
    isLoading,
    error,
    page,
    pageSize,
    totalCount,
    totalPages,
    search,
    statusFilter,
    setPage,
    setSearch,
    setStatusFilter,
    refetch,
  };
};
