import { useState } from "react";
import type { AttendanceRecord, AttendanceStatus } from "../types/Types";

export const useAttendanceGrid = (
  initialRecords: AttendanceRecord[],
  initialComments: string = "",
) => {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [comments, setComments] = useState<string>(initialComments);

  const getNextStatus = (currentStatus: AttendanceStatus): AttendanceStatus => {
    switch (currentStatus) {
      case "EMPTY":
        return "PRESENT";
      case "PRESENT":
        return "ABSENT";
      case "ABSENT":
        return "TARDY";
      case "TARDY":
        return "EMPTY";
      default:
        return "EMPTY";
    }
  };

  const toggleAttendance = (employeeId: string, topicIndex: number) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.employeeId === employeeId) {
          const newEvaluations = [...record.evaluations];
          newEvaluations[topicIndex] = {
            ...newEvaluations[topicIndex],
            status: getNextStatus(newEvaluations[topicIndex].status),
          };
          return { ...record, evaluations: newEvaluations };
        }
        return record;
      }),
    );
  };

  const updateGrade = (
    employeeId: string,
    topicIndex: number,
    newGrade: number | "",
  ) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.employeeId === employeeId) {
          const newEvaluations = [...record.evaluations];
          newEvaluations[topicIndex] = {
            ...newEvaluations[topicIndex],
            grade: newGrade,
          };
          return { ...record, evaluations: newEvaluations };
        }
        return record;
      }),
    );
  };

  return {
    records,
    toggleAttendance,
    updateGrade,
    setComments,
    comments,
  };
};
