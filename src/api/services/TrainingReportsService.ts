import { API_CONFIG } from "../../config/api";
import type { CreateTrainingReportPayload } from "../../types/Types";
import { dataURLtoFile } from "../../utils/eventUtils";
import { apiClient } from "../client";

class TrainingReportsService {
  private createEndpoint = API_CONFIG.endpoint.trainingReports.create;

  async create(payload: CreateTrainingReportPayload): Promise<number> {
    const formData = new FormData();

    formData.append("TrainingType", payload.trainingType);
    formData.append("LeaderName", payload.leaderName);
    formData.append("LeaderPayroll", payload.leaderPayroll);

    if (payload.weekNumber) {
      formData.append("WeekNumber", payload.weekNumber.toString());
    }
    if (payload.observations) {
      formData.append("Observations", payload.observations);
    }

    const processFile = (
      fileData: string | File | undefined,
      fileName: string,
    ) => {
      if (!fileData) return null;
      if (fileData instanceof File) return fileData;
      return dataURLtoFile(fileData, fileName);
    };

    const instructorSig = processFile(
      payload.instructorSignature,
      "instructor_sig.png",
    );

    if (instructorSig) formData.append("InstructorSignature", instructorSig);

    const coordinatorSig = processFile(
      payload.coordinatorSignature,
      "coordinator_sig.png",
    );
    if (coordinatorSig) formData.append("CoordinatorSignature", coordinatorSig);

    const securitySig = processFile(
      payload.securitySignature,
      "security_sig.png",
    );
    if (securitySig) formData.append("SecuritySignature", securitySig);

    if (payload.unionTypes && payload.unionTypes.length > 0) {
      payload.unionTypes.forEach((union, index) => {
        formData.append(
          `UnionTypes[${index}].ListNumber`,
          union.listNumber.toString(),
        );
        formData.append(`UnionTypes[${index}].UnionName`, union.unionName);
      });
    }

    payload.attendees.forEach((att, index) => {
      const baseKey = `Attendees[${index}]`;

      formData.append(`${baseKey}.EmployeeId`, att.employeeId.toString());
      formData.append(`${baseKey}.LineId`, att.lineId.toString());

      formData.append(`${baseKey}.DayMonday`, String(att.dayMonday));
      formData.append(`${baseKey}.DayTuesday`, String(att.dayTuesday));
      formData.append(`${baseKey}.DayWednesday`, String(att.dayWednesday));
      formData.append(`${baseKey}.DayThursday`, String(att.dayThursday));
      formData.append(`${baseKey}.DayFriday`, String(att.dayFriday));
      formData.append(`${baseKey}.DaySaturday`, String(att.daySaturday));
      formData.append(`${baseKey}.DaySunday`, String(att.daySunday));

      if (att.customerClient)
        formData.append(`${baseKey}.CustomerClient`, att.customerClient);
      if (att.unionClassification)
        formData.append(
          `${baseKey}.UnionClassification`,
          att.unionClassification,
        );
      if (att.weldingPercentage)
        formData.append(`${baseKey}.WeldingPercentage`, att.weldingPercentage);
      if (att.diameter) formData.append(`${baseKey}.Diameter`, att.diameter);
      if (att.shift) formData.append(`${baseKey}.Shift`, att.shift);
      if (att.machinery) formData.append(`${baseKey}.Machinery`, att.machinery);
      if (att.ast) formData.append(`${baseKey}.Ast`, att.ast);

      if (att.topicIds && att.topicIds.length > 0) {
        att.topicIds.forEach((topicId, topicIndex) => {
          formData.append(
            `${baseKey}.TopicIds[${topicIndex}]`,
            topicId.toString(),
          );
        });
      }

      const traineeSig = processFile(
        att.traineeSignature,
        `trainee_${att.employeeId}_sig.png`,
      );
      if (traineeSig)
        formData.append(`${baseKey}.TraineeSignature`, traineeSig);

      const supervisorSig = processFile(
        att.supervisorSignature,
        `supervisor_${att.employeeId}_sig.png`,
      );
      if (supervisorSig)
        formData.append(`${baseKey}.SupervisorSignature`, supervisorSig);
    });

    const response = await apiClient.post<any>(this.createEndpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const responseData = response.data ? response.data : response;
    return responseData.id || responseData.Id;
  }
}

export const trainingReportsService = new TrainingReportsService();
