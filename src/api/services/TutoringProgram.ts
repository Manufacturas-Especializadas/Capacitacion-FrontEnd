import { API_CONFIG } from "../../config/api";
import type { Form } from "../../types/Types";
import { apiClient } from "../client";

class TutoringProgram {
  private getFormQuestionsEndpoint =
    API_CONFIG.endpoint.tutoringProgram.getFormQuestion;

  async getFormQuestion(): Promise<Form[]> {
    return apiClient.get<Form[]>(this.getFormQuestionsEndpoint);
  }
}

export const tutoringProgram = new TutoringProgram();
