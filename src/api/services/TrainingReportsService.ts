import { API_CONFIG } from "../../config/api";
import type {
  CreateTrainingReportPayload,
  TrainingReportDetails,
  TrainingReportSignatureValue,
  TrainingReportSummary,
  UpdateTrainingReportAttendee,
  UpdateTrainingReportPayload,
  UpdateTrainingReportResponse,
  UpdateWeldingUnionType,
} from "../../types/Types";
import { dataURLtoFile } from "../../utils/eventUtils";
import { apiClient } from "../client";

interface DeleteTrainingReportResponse {
  message: string;
}

interface CreateTrainingReportResponse {
  message: string;
  id: number;
}

class TrainingReportsService {
  private readonly createEndpoint =
    API_CONFIG.endpoint.trainingReports.create;

  private readonly getByIdEndpoint =
    API_CONFIG.endpoint.trainingReports.getById;

  private readonly getAllEndpoint =
    API_CONFIG.endpoint.trainingReports.getAll;

  private readonly updateEndpoint =
    API_CONFIG.endpoint.trainingReports.update;

  private readonly deleteEndpoint =
    API_CONFIG.endpoint.trainingReports.delete;

  private processFile(
    fileData: TrainingReportSignatureValue | undefined,
    fileName: string,
  ): File | null {
    if (!fileData) {
      return null;
    }

    if (fileData instanceof File) {
      return fileData;
    }

    /*
     * Una firma creada en SignatureModal normalmente será
     * un data URL. Esa sí debe convertirse en File.
     */
    if (fileData.startsWith("data:")) {
      return dataURLtoFile(fileData, fileName);
    }

    /*
     * Si es una URL HTTP de Azure Blob, representa una firma
     * ya existente. No debe enviarse nuevamente.
     */
    return null;
  }

  private buildFormData(
    payload:
      | CreateTrainingReportPayload
      | UpdateTrainingReportPayload,
    includeExistingIds: boolean,
  ): FormData {
    const formData = new FormData();

    formData.append(
      "TrainingType",
      payload.trainingType,
    );

    formData.append(
      "LeaderName",
      payload.leaderName,
    );

    formData.append(
      "LeaderPayroll",
      payload.leaderPayroll,
    );

    if (
      payload.weekNumber !== undefined &&
      payload.weekNumber !== null
    ) {
      formData.append(
        "WeekNumber",
        payload.weekNumber.toString(),
      );
    }

    if (payload.observations?.trim()) {
      formData.append(
        "Observations",
        payload.observations.trim(),
      );
    }

    const instructorSignature = this.processFile(
      payload.instructorSignature,
      "instructor_sig.png",
    );

    if (instructorSignature) {
      formData.append(
        "InstructorSignature",
        instructorSignature,
      );
    }

    const coordinatorSignature = this.processFile(
      payload.coordinatorSignature,
      "coordinator_sig.png",
    );

    if (coordinatorSignature) {
      formData.append(
        "CoordinatorSignature",
        coordinatorSignature,
      );
    }

    const securitySignature = this.processFile(
      payload.securitySignature,
      "security_sig.png",
    );

    if (securitySignature) {
      formData.append(
        "SecuritySignature",
        securitySignature,
      );
    }

    if (includeExistingIds) {
      const updatePayload =
        payload as UpdateTrainingReportPayload;

      formData.append(
        "RemoveInstructorSignature",
        String(
          updatePayload.removeInstructorSignature,
        ),
      );

      formData.append(
        "RemoveCoordinatorSignature",
        String(
          updatePayload.removeCoordinatorSignature,
        ),
      );

      formData.append(
        "RemoveSecuritySignature",
        String(
          updatePayload.removeSecuritySignature,
        ),
      );
    }

    payload.unionTypes?.forEach(
      (union, index) => {
        const baseKey = `UnionTypes[${index}]`;

        if (includeExistingIds) {
          const updateUnion =
            union as UpdateWeldingUnionType;

          if (updateUnion.id !== undefined) {
            formData.append(
              `${baseKey}.Id`,
              updateUnion.id.toString(),
            );
          }
        }

        formData.append(
          `${baseKey}.ListNumber`,
          union.listNumber.toString(),
        );

        formData.append(
          `${baseKey}.UnionName`,
          union.unionName,
        );
      },
    );

    payload.attendees.forEach(
      (attendee, index) => {
        const baseKey = `Attendees[${index}]`;

        if (includeExistingIds) {
          const updateAttendee =
            attendee as UpdateTrainingReportAttendee;

          if (
            updateAttendee.id !== undefined
          ) {
            formData.append(
              `${baseKey}.Id`,
              updateAttendee.id.toString(),
            );
          }

          formData.append(
            `${baseKey}.RemoveTraineeSignature`,
            String(
              updateAttendee
                .removeTraineeSignature,
            ),
          );

          formData.append(
            `${baseKey}.RemoveSupervisorSignature`,
            String(
              updateAttendee
                .removeSupervisorSignature,
            ),
          );
        }

        formData.append(
          `${baseKey}.EmployeeId`,
          attendee.employeeId.toString(),
        );

        formData.append(
          `${baseKey}.LineId`,
          attendee.lineId.toString(),
        );

        formData.append(
          `${baseKey}.DayMonday`,
          String(attendee.dayMonday),
        );

        formData.append(
          `${baseKey}.DayTuesday`,
          String(attendee.dayTuesday),
        );

        formData.append(
          `${baseKey}.DayWednesday`,
          String(attendee.dayWednesday),
        );

        formData.append(
          `${baseKey}.DayThursday`,
          String(attendee.dayThursday),
        );

        formData.append(
          `${baseKey}.DayFriday`,
          String(attendee.dayFriday),
        );

        formData.append(
          `${baseKey}.DaySaturday`,
          String(attendee.daySaturday),
        );

        formData.append(
          `${baseKey}.DaySunday`,
          String(attendee.daySunday),
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.CustomerClient`,
          attendee.customerClient,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.UnionClassification`,
          attendee.unionClassification,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.WeldingPercentage`,
          attendee.weldingPercentage,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.Diameter`,
          attendee.diameter,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.Shift`,
          attendee.shift,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.Machinery`,
          attendee.machinery,
        );

        this.appendOptionalText(
          formData,
          `${baseKey}.Ast`,
          attendee.ast,
        );

        attendee.topicIds.forEach(
          (topicId, topicIndex) => {
            formData.append(
              `${baseKey}.TopicIds[${topicIndex}]`,
              topicId.toString(),
            );
          },
        );

        attendee.topics?.forEach(
          (topic, topicIndex) => {
            const topicBaseKey =
              `${baseKey}.Topics[${topicIndex}]`;

            formData.append(
              `${topicBaseKey}.TopicId`,
              topic.topicId.toString(),
            );

            formData.append(
              `${topicBaseKey}.DayMonday`,
              String(topic.dayMonday),
            );

            formData.append(
              `${topicBaseKey}.DayTuesday`,
              String(topic.dayTuesday),
            );

            formData.append(
              `${topicBaseKey}.DayWednesday`,
              String(topic.dayWednesday),
            );

            formData.append(
              `${topicBaseKey}.DayThursday`,
              String(topic.dayThursday),
            );

            formData.append(
              `${topicBaseKey}.DayFriday`,
              String(topic.dayFriday),
            );

            formData.append(
              `${topicBaseKey}.DaySaturday`,
              String(topic.daySaturday),
            );

            formData.append(
              `${topicBaseKey}.DaySunday`,
              String(topic.daySunday),
            );

            if (
              topic.hoursMonday !== undefined &&
              topic.hoursMonday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursMonday`,
                topic.hoursMonday.toString(),
              );
            }

            if (
              topic.hoursTuesday !== undefined &&
              topic.hoursTuesday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursTuesday`,
                topic.hoursTuesday.toString(),
              );
            }

            if (
              topic.hoursWednesday !== undefined &&
              topic.hoursWednesday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursWednesday`,
                topic.hoursWednesday.toString(),
              );
            }

            if (
              topic.hoursThursday !== undefined &&
              topic.hoursThursday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursThursday`,
                topic.hoursThursday.toString(),
              );
            }

            if (
              topic.hoursFriday !== undefined &&
              topic.hoursFriday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursFriday`,
                topic.hoursFriday.toString(),
              );
            }

            if (
              topic.hoursSaturday !== undefined &&
              topic.hoursSaturday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursSaturday`,
                topic.hoursSaturday.toString(),
              );
            }

            if (
              topic.hoursSunday !== undefined &&
              topic.hoursSunday !== null
            ) {
              formData.append(
                `${topicBaseKey}.HoursSunday`,
                topic.hoursSunday.toString(),
              );
            }

            if (
              topic.totalHours !== undefined &&
              topic.totalHours !== null
            ) {
              formData.append(
                `${topicBaseKey}.TotalHours`,
                topic.totalHours.toString(),
              );
            }
          },
        );

        const traineeSignature =
          this.processFile(
            attendee.traineeSignature,
            `trainee_${attendee.employeeId}_sig.png`,
          );

        if (traineeSignature) {
          formData.append(
            `${baseKey}.TraineeSignature`,
            traineeSignature,
          );
        }

        const supervisorSignature =
          this.processFile(
            attendee.supervisorSignature,
            `supervisor_${attendee.employeeId}_sig.png`,
          );

        if (supervisorSignature) {
          formData.append(
            `${baseKey}.SupervisorSignature`,
            supervisorSignature,
          );
        }
      },
    );

    return formData;
  }

  private appendOptionalText(
    formData: FormData,
    key: string,
    value: string | undefined,
  ): void {
    if (value?.trim()) {
      formData.append(key, value.trim());
    }
  }

  async create(
    payload: CreateTrainingReportPayload,
  ): Promise<number> {
    const formData = this.buildFormData(
      payload,
      false,
    );

    const response =
      await apiClient.post<CreateTrainingReportResponse>(
        this.createEndpoint,
        formData,
      );

    return response.id;
  }

  async update(
    reportId: number,
    payload: UpdateTrainingReportPayload,
  ): Promise<UpdateTrainingReportResponse> {
    if (
      !Number.isInteger(reportId) ||
      reportId <= 0
    ) {
      throw new Error(
        "El identificador del reporte no es válido.",
      );
    }

    const formData = this.buildFormData(
      payload,
      true,
    );

    return apiClient.put<UpdateTrainingReportResponse>(
      `${this.updateEndpoint}${reportId}`,
      formData,
    );
  }

  async getById(
    id: number,
  ): Promise<TrainingReportDetails> {
    return apiClient.get<TrainingReportDetails>(
      `${this.getByIdEndpoint}${id}`,
    );
  }

  async getAll(): Promise<
    TrainingReportSummary[]
  > {
    return apiClient.get<
      TrainingReportSummary[]
    >(this.getAllEndpoint);
  }

  async delete(
    id: number,
  ): Promise<DeleteTrainingReportResponse> {
    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      throw new Error(
        "El identificador del reporte no es válido.",
      );
    }

    return apiClient.delete<DeleteTrainingReportResponse>(
      `${this.deleteEndpoint}${id}`,
    );
  }
}

export const trainingReportsService =
  new TrainingReportsService();