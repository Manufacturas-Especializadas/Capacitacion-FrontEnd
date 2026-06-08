import { API_CONFIG } from "../../config/api";
import type {
  AssignAttendees,
  CreateTrainingEvent,
  SaveAttendance,
  TrainingEventDetail,
  TrainingEvents,
} from "../../types/Types";
import { apiClient } from "../client";

class TrainingEventService {
  private getTrainingEventsEndpoint =
    API_CONFIG.endpoint.trainingEvent.getTrainingEvents;
  private getDetailsEndpoint =
    API_CONFIG.endpoint.trainingEvent.trainingEventsDetails;
  private createEventEndpoint = API_CONFIG.endpoint.trainingEvent.createEvent;
  private deleteEventEndpoint = API_CONFIG.endpoint.trainingEvent.delete;
  private assignAttendeesEndpoint =
    API_CONFIG.endpoint.trainingEvent.assingAttendees;
  private saveAttendanceEndpoint =
    API_CONFIG.endpoint.trainingEvent.saveAttendance;

  async getTrainingEvents(): Promise<TrainingEvents[]> {
    return apiClient.get<TrainingEvents[]>(this.getTrainingEventsEndpoint);
  }

  async getDetails(id: number): Promise<TrainingEventDetail> {
    return apiClient.get<TrainingEventDetail>(
      `${this.getDetailsEndpoint}${id}`,
    );
  }

  async createEvent(data: CreateTrainingEvent): Promise<number> {
    const response = await apiClient.post<{ eventId: number }>(
      this.createEventEndpoint,
      data,
    );
    return response.eventId;
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete(`${this.deleteEventEndpoint}${id}`);
  }

  async assignAttendees(data: AssignAttendees): Promise<void> {
    return apiClient.post<void>(this.assignAttendeesEndpoint, data);
  }

  async saveAttendance(data: SaveAttendance, id: number): Promise<void> {
    return apiClient.post<void>(`${this.saveAttendanceEndpoint}${id}`, data);
  }
}

export const trainingEventService = new TrainingEventService();
