import { useEffect, useState } from "react";
import type { CreateEmployee, Employee } from "../types/Types";
import { employeeService } from "../api/services/EmployeeService";
import { toast } from "sonner";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);

    try {
      const data = await employeeService.getAllEmployee();
      setEmployees(data);
    } catch (error) {
      console.error("Error al cargar empleados", error);
      toast.error("No se pudieron cargar los empleados de las base de datos");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployeeById = async (id: number): Promise<Employee | null> => {
    try {
      const data = await employeeService.getEmployeeById(id);
      return data;
    } catch (err: any) {
      console.error("Error al obtener el empleado por Id: ", err);
      toast.error("Error al obtener la información del empleado seleccionado");
      return null;
    }
  };
  const createNewEmployee = async (
    data: CreateEmployee,
  ): Promise<Employee | null> => {
    try {
      const newEmp = await employeeService.createEmployee(data);
      setEmployees((prev) => [...prev, newEmp]);
      toast.success("Empleado registrado");

      return newEmp;
    } catch (error) {
      console.error("Error al crear empleado", error);
      toast.error("Hubo un error al registrar");

      return null;
    }
  };

  const updateEmployee = async (data: CreateEmployee, id: number) => {
    try {
      await employeeService.updateEmployee(data, id);

      toast.success("Empleado actualizado");

      return;
    } catch (err: any) {
      console.error("Error al actualizar el empleado");
      toast.error("Hubo un error al actualizar el empleado");

      return null;
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await employeeService.deleteEmployee(id);
    } catch (err: any) {
      console.error("Error al eliminar el empleado: ", err);
      toast.error("Error al intentar eliminar el empleado");
    }
  };

  return {
    employees,
    isLoadingEmployees,
    fetchEmployeeById,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
  };
};
