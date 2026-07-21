import { useCallback, useEffect, useState } from "react";
import type { Form } from "../types/Types";
import { tutoringProgramService } from "../api/services/TutoringProgramService";
import { toast } from "sonner";

export const useTutoringPrograms = () => {
  const [data, setData] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await tutoringProgramService.getFormQuestion();
      setData(response);
    } catch (err: any) {
      toast.error("Error de conexión", {
        description: "No se pudieron sincronizar las preguntas",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    data,
    loading,
  };
};
