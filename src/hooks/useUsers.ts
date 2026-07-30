import { useCallback, useEffect, useState } from "react";
import { usersService } from "../api/services/UsersService";
import { toast } from "sonner";
import type { Roles, Users } from "../types/Types";

export const useUsers = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const getRoles = useCallback(async () => {
    try {
      const data = await usersService.getRoles();
      setRoles(data);
    } catch (error: any) {
      console.error("Error al obtener los roles");
      toast.error("No se pudieron obtener los roles");
    }
  }, []);

  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error al obtener los usuarios", error);
      toast.error("No se pudieron obtener los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    getRoles();
    getUsers();
  }, []);

  return {
    getRoles,
    roles,
    getUsers,
    users,
    loading,
    isCreating,
    createUser,
  };
};
