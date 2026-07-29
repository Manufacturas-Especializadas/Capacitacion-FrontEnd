import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";

class AuthService {
  private loginEndpoint = API_CONFIG.endpoint.auth.login;

  async login(payrollNumber: string, password: string): Promise<any> {
    return apiClient.post<any>(this.loginEndpoint, {
      payrollNumber,
      password,
    });
  }
}

export const authService = new AuthService();
