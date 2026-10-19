import { API_CONFIG } from "../../config/api";
import type {
  AssignAttendees,
  CreateTrainingEvent,
  PagedResult,
  SaveAttendance,
  TrainingEventDetail,
  TrainingEvents,
  TrainingEventsQuery,
  UpdateTrainingEvent,
} from "../../types/Types";
import { apiClient } from "../client";

class TrainingEventService {
  private getTrainingEventsEndpoint = API_CONFIG.endpoint.trainingEvent.getTrainingEvents;
  private getDetailsEndpoint = API_CONFIG.endpoint.trainingEvent.trainingEventsDetails;
  private createEventEndpoint = API_CONFIG.endpoint.trainingEvent.createEvent;
  private deleteEventEndpoint = API_CONFIG.endpoint.trainingEvent.delete;
  private assignAttendeesEndpoint = API_CONFIG.endpoint.trainingEvent.assingAttendees;
  private saveAttendanceEndpoint = API_CONFIG.endpoint.trainingEvent.saveAttendance;
  private updateAttendeesEndpoint = API_CONFIG.endpoint.trainingEvent.updateAttendees;
  private updateEventEndpoint = API_CONFIG.endpoint.trainingEvent.updateEvent;
  async getTrainingEvents(
    { page = 1, pageSize = 25, search, status }: TrainingEventsQuery = {},
    signal?: AbortSignal,
  ): Promise<PagedResult<TrainingEvents>> {
    return apiClient.get<PagedResult<TrainingEvents>>(
      this.getTrainingEventsEndpoint,
      {
        params: {
          page,
          pageSize,
          search: search?.trim() || undefined,
          status: status?.trim() || undefined,
        },
        signal,
      },
    );
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

  async updateAttendees(id: number, data: AssignAttendees,): Promise<void> {
    await apiClient.put<void>(
      `${this.updateAttendeesEndpoint}${id}`,
      data,
    );
  }

  async updateEvent(id: number, data: UpdateTrainingEvent,): Promise<void> {
    await apiClient.put<void>(
      `${this.updateEventEndpoint}${id}`,
      data,
    );
  }

}

export const trainingEventService = new TrainingEventService();
