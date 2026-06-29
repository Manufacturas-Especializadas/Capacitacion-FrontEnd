import { API_CONFIG } from "../../config/api";
import type { CreateEmployee, Employee } from "../../types/Types";
import { apiClient } from "../client";

class EmployeeService {
  private getAllEmployeeEndpoint = API_CONFIG.endpoint.employees.allEmployees;
  private createEmployeeEndpoint = API_CONFIG.endpoint.employees.createEmployee;
  private updateEmployeeEndpoint = API_CONFIG.endpoint.employees.updateEmployee;

  async getAllEmployee(): Promise<Employee[]> {
    return apiClient.get<Employee[]>(this.getAllEmployeeEndpoint);
  }

  async createEmployee(data: CreateEmployee): Promise<Employee> {
    return apiClient.post<Employee>(this.createEmployeeEndpoint, data);
  }

  async updateEmployee(data: CreateEmployee, id: number): Promise<any> {
    return apiClient.put<any>(`${this.updateEmployeeEndpoint}${id}`, data);
  }
}

export const employeeService = new EmployeeService();
