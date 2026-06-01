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

  return {
    employees,
    isLoadingEmployees,
    createNewEmployee,
  };
};
