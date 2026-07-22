import { API_CONFIG } from "../../config/api";
import type {
  FollowUpWeeks,
  ProductionLines,
  TrainingRooms,
  Tutors,
} from "../../types/Types";
import { apiClient } from "../client";

class CatalogsService {
  private getRoomsEndpoint = API_CONFIG.endpoint.catalgos.rooms;
  private getProductionLinesEndpoint = API_CONFIG.endpoint.catalgos.lines;
  private getTutorsEndpoint = API_CONFIG.endpoint.catalgos.tutors;
  private getWeeksEndpoint = API_CONFIG.endpoint.catalgos.weeks;

  async getRooms(): Promise<TrainingRooms[]> {
    return apiClient.get<TrainingRooms[]>(this.getRoomsEndpoint);
  }

  async getProductionLines(): Promise<ProductionLines[]> {
    return apiClient.get<ProductionLines[]>(this.getProductionLinesEndpoint);
  }

  async getTutors(): Promise<Tutors[]> {
    return apiClient.get<Tutors[]>(this.getTutorsEndpoint);
  }

  async getWeeks(): Promise<FollowUpWeeks[]> {
    return apiClient.get<FollowUpWeeks[]>(this.getWeeksEndpoint);
  }
}

export const catalogsService = new CatalogsService();
