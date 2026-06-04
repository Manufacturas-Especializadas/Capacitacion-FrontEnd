import type { TrainingEventData, AttendanceRecord } from "../types/Types";

export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const calculateTopicStats = (
  records: AttendanceRecord[],
  evaluationTopics: string[],
) => {
  return evaluationTopics.map((_, topicIdx) => {
    let possible = 0;
    let actual = 0;
    let sumGrades = 0;
    let countGrades = 0;

    records.forEach((record) => {
      const evaluation = record.evaluations[topicIdx];

      if (evaluation && evaluation.status) {
        const status = evaluation.status.toUpperCase() as string;

        if (status !== "EMPTY" && status !== "PENDING") {
          possible++;
          const isPresentOrLate = [
            "PRESENT",
            "LATE",
            "TARDY",
            "R",
            "RETARDO",
          ].includes(status);
          if (isPresentOrLate) actual++;

          const isAbsent = ["ABSENT", "X", "FALTA"].includes(status);
          const grade = Number(evaluation.grade);

          if (
            !isAbsent &&
            evaluation.grade !== null &&
            !isNaN(grade) &&
            grade > 0
          ) {
            sumGrades += grade;
            countGrades++;
          }
        }
      }
    });

    return {
      attendance: possible > 0 ? Math.round((actual / possible) * 100) : 0,
      average: countGrades > 0 ? Math.round(sumGrades / countGrades) : null,
    };
  });
};

export const buildAttendanceFormData = (
  eventData: TrainingEventData,
  records: AttendanceRecord[],
  comments: string,
  isFinal: boolean,
  instructorSignature: string | null,
): FormData => {
  const formData = new FormData();

  formData.append("EventId", eventData.id.toString());
  formData.append("Comments", comments || "");
  formData.append("IsFinalSave", isFinal.toString());

  if (instructorSignature && instructorSignature.startsWith("data:image")) {
    const file = dataURLtoFile(instructorSignature, "instructor_signature.png");
    formData.append("InstructorSignature", file);
  }

  records.forEach((record, index) => {
    formData.append(
      `EmployeeRecords[${index}].EmployeeId`,
      record.employeeId.toString(),
    );

    if (
      record.signature &&
      record.signature.trim() !== "" &&
      record.signature.startsWith("data:image")
    ) {
      const empFile = dataURLtoFile(
        record.signature,
        `emp_${record.employeeId}_signature.png`,
      );
      formData.append(`EmployeeRecords[${index}].Signature`, empFile);
    }

    record.evaluations.forEach((ev, evIndex) => {
      formData.append(
        `EmployeeRecords[${index}].Evaluations[${evIndex}].Status`,
        ev.status,
      );

      const isAbsent = ev.status === "ABSENT" || ev.status === "X";
      if (!isAbsent && ev.grade !== null) {
        formData.append(
          `EmployeeRecords[${index}].Evaluations[${evIndex}].Grade`,
          ev.grade.toString(),
        );
      }
    });
  });

  return formData;
};
