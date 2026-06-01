import { API_CONFIG } from "../../config/api";
import type { ProductionLines, TrainingRooms } from "../../types/Types";
import { apiClient } from "../client";

class CatalogsService {
  private getRoomsEndpoint = API_CONFIG.endpoint.catalgos.rooms;
  private getProductionLinesEndpoint = API_CONFIG.endpoint.catalgos.lines;

  async getRooms(): Promise<TrainingRooms[]> {
    return apiClient.get<TrainingRooms[]>(this.getRoomsEndpoint);
  }

  async getProductionLines(): Promise<ProductionLines[]> {
    return apiClient.get<ProductionLines[]>(this.getProductionLinesEndpoint);
  }
}

export const catalogsService = new CatalogsService();
