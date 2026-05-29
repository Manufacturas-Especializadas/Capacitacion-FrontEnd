import { API_CONFIG } from "../../config/api";
import type { Employee } from "../../types/Types";
import { apiClient } from "../client";

class EmployeeService {
  private getAllEmployeeEndpoint = API_CONFIG.endpoint.employees.allEmployees;

  async getAllEmployee(): Promise<Employee[]> {
    return apiClient.get<Employee[]>(this.getAllEmployeeEndpoint);
  }
}

export const employeeService = new EmployeeService();
