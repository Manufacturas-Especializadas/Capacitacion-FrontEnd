import { API_CONFIG } from "../../config/api";
import type { Roles, Users } from "../../types/Types";
import { apiClient } from "../client";

class UsersService {
  private getRolesEndpoint = API_CONFIG.endpoint.users.getRoles;
  private getUsersEndpoint = API_CONFIG.endpoint.users.getUsers;
  private createEndpoint = API_CONFIG.endpoint.users.create;

  async getRoles(): Promise<Roles[]> {
    return apiClient.get<Roles[]>(this.getRolesEndpoint);
  }

  async getUsers(): Promise<Users[]> {
    return apiClient.get<Users[]>(this.getUsersEndpoint);
  }

  async create(
    payrollNumber: string,
    password: string,
    roleId: number,
  ): Promise<any> {
    return apiClient.post<any>(this.createEndpoint, {
      payrollNumber,
      password,
      roleId,
    });
  }
}

export const usersService = new UsersService();
