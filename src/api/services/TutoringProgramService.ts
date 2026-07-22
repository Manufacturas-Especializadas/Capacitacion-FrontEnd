import { API_CONFIG } from "../../config/api";
import type { Form, TutoringProgramPayload } from "../../types/Types";
import { apiClient } from "../client";

class TutoringProgramService {
  private getFormQuestionsEndpoint =
    API_CONFIG.endpoint.tutoringProgram.getFormQuestion;
  private createEndpoint = API_CONFIG.endpoint.tutoringProgram.create;

  async getFormQuestion(): Promise<Form[]> {
    return apiClient.get<Form[]>(this.getFormQuestionsEndpoint);
  }

  async create(data: TutoringProgramPayload): Promise<any> {
    return apiClient.post<any>(this.createEndpoint, data);
  }
}

export const tutoringProgramService = new TutoringProgramService();
