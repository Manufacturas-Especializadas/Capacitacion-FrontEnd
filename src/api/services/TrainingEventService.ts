import { API_CONFIG } from "../../config/api";
import type { AssignAttendees, CreateTrainingEvent } from "../../types/Types";
import { apiClient } from "../client";

class TrainingEventService {
  private createEventEndpoint = API_CONFIG.endpoint.trainingEvent.createEvent;
  private assignAttendeesEndpoint =
    API_CONFIG.endpoint.trainingEvent.assingAttendees;

  async createEvent(data: CreateTrainingEvent): Promise<void> {
    return apiClient.post<void>(this.createEventEndpoint, data);
  }

  async assignAttendees(data: AssignAttendees): Promise<void> {
    return apiClient.post<void>(this.assignAttendeesEndpoint, data);
  }
}

export const trainingEventService = new TrainingEventService();
