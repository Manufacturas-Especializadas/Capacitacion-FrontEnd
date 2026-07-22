import { API_CONFIG } from "../../config/api";
import type {
  Form,
  TutoringProgramList,
  TutoringProgramPayload,
} from "../../types/Types";
import { apiClient } from "../client";

class TutoringProgramService {
  private getFormQuestionsEndpoint =
    API_CONFIG.endpoint.tutoringProgram.getFormQuestion;
  private getByIdEndpoint = API_CONFIG.endpoint.tutoringProgram.getById;
  private createEndpoint = API_CONFIG.endpoint.tutoringProgram.create;
  private updateEndpoint = API_CONFIG.endpoint.tutoringProgram.update;
  private deleteEndpoint = API_CONFIG.endpoint.tutoringProgram.delete;

  async getFormQuestion(): Promise<Form[]> {
    return apiClient.get<Form[]>(this.getFormQuestionsEndpoint);
  }

  async getById(id: number): Promise<TutoringProgramList> {
    return apiClient.get<TutoringProgramList>(`${this.getByIdEndpoint}${id}`);
  }

  async create(data: TutoringProgramPayload): Promise<any> {
    return apiClient.post<any>(this.createEndpoint, data);
  }

  async update(data: TutoringProgramPayload, id: number): Promise<any> {
    return apiClient.put<any>(`${this.updateEndpoint}${id}`, data);
  }

  async delete(id: number): Promise<any> {
    return apiClient.delete<any>(`${this.deleteEndpoint}${id}`);
  }
}

export const tutoringProgramService = new TutoringProgramService();
