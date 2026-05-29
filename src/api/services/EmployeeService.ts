import { API_CONFIG } from "../../config/api";
import type { CreateEmployee, Employee } from "../../types/Types";
import { apiClient } from "../client";

class EmployeeService {
  private getAllEmployeeEndpoint = API_CONFIG.endpoint.employees.allEmployees;
  private createEmployeeEndpoint = API_CONFIG.endpoint.employees.createEmployee;

  async getAllEmployee(): Promise<Employee[]> {
    return apiClient.get<Employee[]>(this.getAllEmployeeEndpoint);
  }

  async createEmployee(data: CreateEmployee): Promise<void> {
    return apiClient.post<void>(this.createEmployeeEndpoint, data);
  }
}

export const employeeService = new EmployeeService();
