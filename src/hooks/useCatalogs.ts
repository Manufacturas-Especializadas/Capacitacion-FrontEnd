import { useCallback, useState } from "react";
import type { ProductionLines, TrainingRooms } from "../types/Types";
import { catalogsService } from "../api/services/CatalogsService";
import { toast } from "sonner";

export const useCatalogs = () => {
  const [rooms, setRooms] = useState<TrainingRooms[]>([]);
  const [lines, setLines] = useState<ProductionLines[]>([]);
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

  const fetchAll = async () => {
    setIsLoadingCatalogs(true);
    await Promise.all([fetchRooms(), fetchLines()]);
    setIsLoadingCatalogs(false);
  };

  return {
    rooms,
    lines,
    fetchRooms,
    fetchLines,
    fetchAll,
    isLoadingCatalogs,
  };
};
