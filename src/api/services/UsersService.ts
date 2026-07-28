import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";

class UsersService {
  private createEndpoint = API_CONFIG.endpoint.users.create;

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
