import { useCallback, useEffect, useState } from "react";
import type {
  Form,
  TutoringProgramList,
  TutoringProgramPayload,
} from "../types/Types";
import { tutoringProgramService } from "../api/services/TutoringProgramService";
import { toast } from "sonner";

export const useTutoringPrograms = () => {
  const [data, setData] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFetchingProgram, setIsFetchingProgram] = useState<boolean>(false);

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

  const getProgramById = async (
    id: number,
  ): Promise<TutoringProgramList | null> => {
    setIsFetchingProgram(true);
    try {
      const response = await tutoringProgramService.getById(id);

      return response;
    } catch (error) {
      toast.error("Error al cargar", {
        description: "No se puedo obtener el programa",
      });

      return null;
    } finally {
      setIsFetchingProgram(false);
    }
  };

  const createProgram = async (payload: TutoringProgramPayload) => {
    setIsSubmitting(true);
    try {
      await tutoringProgramService.create(payload);
      toast.success("Registro exitoso", {
        description: "El programa de tutoreo se ha guardado correctament",
      });

      return true;
    } catch (error) {
      console.error("Error al guardar el programa: ", error);
      toast.error("Error al guardar", {
        description: "Ocurrio un problema al enviar los datos.",
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProgram = async (payload: TutoringProgramPayload, id: number) => {
    setIsSubmitting(true);
    try {
      await tutoringProgramService.update(payload, id);
      toast.success("Actualizacion exitosa", {
        description: "Los cambios han sido guardados",
      });

      return true;
    } catch (error) {
      toast.error("Error al actualizar", {
        description: "No se pudieron guardar los cambios",
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    data,
    loading,
    isSubmitting,
    isFetchingProgram,
    getProgramById,
    createProgram,
    updateProgram,
  };
};
