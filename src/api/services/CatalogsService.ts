import { API_CONFIG } from "../../config/api";
import type { TrainingRooms } from "../../types/Types";
import { apiClient } from "../client";

class CatalogsService {
  private getRoomsEndpoint = API_CONFIG.endpoint.catalgos.rooms;

  async getRooms(): Promise<TrainingRooms[]> {
    return apiClient.get<TrainingRooms[]>(this.getRoomsEndpoint);
  }
}

export const catalogsService = new CatalogsService();
