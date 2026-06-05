import { API_CONFIG } from "../../config/api";

class WeldersChecklistService {
  private createEndpoint = API_CONFIG.endpoint.weldersChecklist.create;
}

export const weldersChecklistService = new WeldersChecklistService();
