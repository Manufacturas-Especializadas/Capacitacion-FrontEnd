import { useCallback, useState } from "react";
import { toast } from "sonner";
import { trainingTopicsService } from "../api/services/TrainingTopicsService";
import type { CreateTrainingTopics, TrainingTopicsAll } from "../types/Types";

export const useTrainingTopics = () => {
  const [topics, setTopics] = useState<TrainingTopicsAll[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await trainingTopicsService.getAll();
      setTopics(data);
    } catch (err: any) {
      console.error("Error fetching topics: ", err);
      toast.error("No se pudieron cargar los temas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTopic = async (data: CreateTrainingTopics): Promise<boolean> => {
    setIsLoading(true);
    try {
      await trainingTopicsService.create(data);
      toast.success("Tema de entrenamiento creado correctamente");
      return true;
    } catch (error) {
      console.error("Error creating topic:", error);
      toast.error("Ocurrió un error al crear el tema");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTopic = async (
    id: number,
    data: CreateTrainingTopics,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await trainingTopicsService.update(id, data);
      toast.success("Tema actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error("Ocurrió un error al actualizar el tema");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTopic = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await trainingTopicsService.delete(id);
      toast.success("Tema eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Ocurrió un error al eliminar el tema");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    topics,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
  };
};
