import { API_CONFIG } from "../../config/api";
import type { CreateTrainingTopics } from "../../types/Types";
import { apiClient } from "../client";

class TrainingTopicsService {
  private createEndpoint = API_CONFIG.endpoint.trainingTopics.create;

  async create(data: CreateTrainingTopics): Promise<any> {
    return apiClient.post<any>(this.createEndpoint, data);
  }
}

export const trainingTopicsService = new TrainingTopicsService();
