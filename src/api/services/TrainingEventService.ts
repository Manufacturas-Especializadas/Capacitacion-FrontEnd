import { API_CONFIG } from "../../config/api";
import type { CreateTrainingEvent } from "../../types/Types";
import { apiClient } from "../client";

class TrainingEventService {
  private createEventEndpoint = API_CONFIG.endpoint.trainingEvent.createEvent;

  async createEvent(data: CreateTrainingEvent): Promise<void> {
    return apiClient.post<void>(this.createEventEndpoint, data);
  }
}

export const trainingEventService = new TrainingEventService();
