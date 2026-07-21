import { useCallback, useState } from "react";
import type { ProductionLines, TrainingRooms, Tutors } from "../types/Types";
import { catalogsService } from "../api/services/CatalogsService";
import { toast } from "sonner";

export const useCatalogs = () => {
  const [rooms, setRooms] = useState<TrainingRooms[]>([]);
  const [lines, setLines] = useState<ProductionLines[]>([]);
  const [tutors, setTutors] = useState<Tutors[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);

  const fetchRooms = async () => {
    try {
      const data = await catalogsService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Error al cargar salas", error);
      toast.error("Error al cargar las salas");
    }
  };

  const fetchLines = useCallback(async () => {
    try {
      const data = await catalogsService.getProductionLines();
      setLines(data);
    } catch (error) {
      console.error("Error al cargar las lineas", error);
      toast.error("Error al cargar las lineas");
    }
  }, []);

  const fetchTutors = useCallback(async () => {
    try {
      const data = await catalogsService.getTutors();
      setTutors(data);
    } catch (error) {
      console.error("Error al cargar los tutores");
      toast.error("Error al cargar los tutores");
    }
  }, []);

  const fetchAll = async () => {
    setIsLoadingCatalogs(true);
    await Promise.all([fetchRooms(), fetchLines(), fetchTutors()]);
    setIsLoadingCatalogs(false);
  };

  return {
    rooms,
    lines,
    fetchRooms,
    fetchLines,
    tutors,
    fetchTutors,
    fetchAll,
    isLoadingCatalogs,
  };
};
