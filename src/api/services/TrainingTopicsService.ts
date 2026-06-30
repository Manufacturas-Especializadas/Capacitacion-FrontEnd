import { API_CONFIG } from "../../config/api";
import type {
  CreateTrainingTopics,
  TrainingTopicsAll,
} from "../../types/Types";
import { apiClient } from "../client";

class TrainingTopicsService {
  private getAllEndpoint = API_CONFIG.endpoint.trainingTopics.all;
  private createEndpoint = API_CONFIG.endpoint.trainingTopics.create;
  private updateEndpoint = API_CONFIG.endpoint.trainingTopics.update;
  private deleteEndpoint = API_CONFIG.endpoint.trainingTopics.delete;

  async getAll(): Promise<TrainingTopicsAll[]> {
    return apiClient.get<TrainingTopicsAll[]>(this.getAllEndpoint);
  }

  async create(data: CreateTrainingTopics): Promise<any> {
    return apiClient.post<any>(this.createEndpoint, data);
  }

  async update(id: number, data: CreateTrainingTopics): Promise<any> {
    return apiClient.put<any>(`${this.updateEndpoint}${id}`, data);
  }

  async delete(id: number): Promise<any> {
    return apiClient.delete<any>(`${this.deleteEndpoint}${id}`);
  }
}

export const trainingTopicsService = new TrainingTopicsService();
