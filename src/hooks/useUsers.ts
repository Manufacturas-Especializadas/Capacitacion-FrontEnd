import { useCallback, useState } from "react";
import { usersService } from "../api/services/UsersService";
import { toast } from "sonner";

export const useUsers = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const createUser = useCallback(
    async (payrollNumber: string, password: string, roleId: number) => {
      setIsCreating(true);

      try {
        await usersService.create(payrollNumber, password, roleId);

        toast.success("Usuario registrado", {
          description: `El número de nómina ${payrollNumber} ahora tiene acceso al sistema.`,
        });
      } catch (error: any) {
        console.error("Error al registrar usuario: ", error);

        const errorMessage =
          error.response?.data?.message ||
          "Ocurrio un error al intentar crear el usuario.";

        toast.error("Error de registro", {
          description: errorMessage,
        });

        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return {
    isCreating,
    createUser,
  };
};
