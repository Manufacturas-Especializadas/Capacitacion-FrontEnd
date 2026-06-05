import { API_CONFIG } from "../../config/api";
import type {
  WelderEvaluations,
  WelderEvaluationsDetails,
} from "../../types/Types";
import { dataURLtoFile } from "../../utils/eventUtils";
import { apiClient } from "../client";

class WeldersChecklistService {
  private getByIdEndpoint = API_CONFIG.endpoint.weldersChecklist.byId;
  private createEndpoint = API_CONFIG.endpoint.weldersChecklist.create;

  async getById(id: number): Promise<WelderEvaluationsDetails> {
    return apiClient.get<WelderEvaluationsDetails>(
      `${this.getByIdEndpoint}${id}`,
    );
  }

  async create(payload: WelderEvaluations): Promise<void> {
    const formData = new FormData();

    formData.append("EmployeeNumber", payload.employeeNumber);
    formData.append("EvaluationDate", payload.evaluationDate);
    formData.append("EvaluatorName", payload.evaluatorName);

    formData.append("ExclusiveTestReference", payload.exclusiveTestReference);
    if (payload.exclusiveTestResult) {
      formData.append("ExclusiveTestResult", payload.exclusiveTestResult);
    }

    formData.append("PracticalGrade", payload.practicalGrade.toString());
    formData.append("UnionGrade", payload.unionGrade.toString());
    formData.append("FinalAverage", payload.finalAverage.toString());
    formData.append("MasteryLevel", payload.masteryLevel);

    payload.practicalAnswers.forEach((ans, index) => {
      formData.append(
        `PracticalAnswers[${index}].SectionTitle`,
        ans.sectionTitle,
      );
      formData.append(
        `PracticalAnswers[${index}].QuestionText`,
        ans.questionText,
      );
      formData.append(`PracticalAnswers[${index}].Score`, ans.score.toString());
    });

    payload.unionAnswers.forEach((ans, index) => {
      formData.append(
        `UnionAnswers[${index}].AttributeName`,
        ans.attributeName,
      );
      if (ans.answerText) {
        formData.append(`UnionAnswers[${index}].AnswerText`, ans.answerText);
      }
      formData.append(`UnionAnswers[${index}].Score`, ans.score.toString());
    });

    const evidenceFile = dataURLtoFile(payload.evidencePhoto, "evidencia.png");
    if (evidenceFile) formData.append("EvidencePhoto", evidenceFile);

    const sigColaborador = dataURLtoFile(
      payload.signatureColaborador,
      "firma_colaborador.png",
    );
    if (sigColaborador) formData.append("SignatureColaborador", sigColaborador);

    const sigCoordArea = dataURLtoFile(
      payload.signatureCoordinadorArea,
      "firma_coord_area.png",
    );
    if (sigCoordArea) formData.append("SignatureCoordinadorArea", sigCoordArea);

    const sigCoordCap = dataURLtoFile(
      payload.signatureCoordCapacitacion,
      "firma_coord_cap.png",
    );
    if (sigCoordCap) formData.append("SignatureCoordCapacitacion", sigCoordCap);

    const sigSupervisor = dataURLtoFile(
      payload.signatureSupervisor,
      "firma_supervisor.png",
    );
    if (sigSupervisor) formData.append("SignatureSupervisor", sigSupervisor);

    const sigEvaluador = dataURLtoFile(
      payload.signatureEvaluador,
      "firma_evaluador.png",
    );
    if (sigEvaluador) formData.append("SignatureEvaluador", sigEvaluador);

    const response = await apiClient.post<any>(this.createEndpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responseData = response.data ? response.data : response;

    return responseData.id || responseData.Id;
  }
}

export const weldersChecklistService = new WeldersChecklistService();
