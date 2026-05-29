import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainingEventMutations } from "./useTrainingEventMutations";
import type { Employee } from "../types/Types";
import { trainingEventService } from "../api/services/TrainingEventService";

export interface EnrolledRow {
  id: string;
  employee: Employee | null;
  enrollments: boolean[];
}

export const useEnrollment = (
  eventId: number | undefined,
  expectedAttendees: number,
) => {
  const navigate = useNavigate();
  const { assignAttendees, isAssing } = useTrainingEventMutations();

  const [topics, setTopics] = useState<string[]>([]);
  const [rows, setRows] = useState<EnrolledRow[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  useEffect(() => {
    if (!eventId) {
      navigate("/");
      return;
    }

    const fetchEventData = async () => {
      try {
        const data = await trainingEventService.getDetails(Number(eventId));

        const fetchedTopics = data.eventData?.evaluationTopics || [];
        setTopics(fetchedTopics);

        const initialRows = Array.from({ length: expectedAttendees }).map(
          (_, i) => ({
            id: `row-${Date.now()}-${i}`,
            employee: null,
            enrollments: Array(fetchedTopics.length).fill(true),
          }),
        );

        setRows(initialRows);
      } catch (error) {
        console.error("Error cargando el evento", error);
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEventData();
  }, [eventId, expectedAttendees, navigate]);

  const addEmptyRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        employee: null,
        enrollments: Array(topics.length).fill(true),
      },
    ]);
  };

  const updateEmployee = (rowId: string, employee: Employee) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, employee } : r)),
    );
  };

  const toggleEnrollment = (rowId: string, topicIndex: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === rowId) {
          const newEnrollments = [...r.enrollments];
          newEnrollments[topicIndex] = !newEnrollments[topicIndex];
          return { ...r, enrollments: newEnrollments };
        }
        return r;
      }),
    );
  };

  const removeRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const saveAssignments = async () => {
    const validRows = rows.filter((r) => r.employee !== null);
    if (validRows.length === 0) return;

    const payload = {
      eventId: Number(eventId),
      attendees: validRows.map((r) => ({
        employeeNumber: r.employee!.employeeNumber,
        name: r.employee!.name,
        lineName: r.employee!.line,
        enrollments: r.enrollments,
      })),
    };

    const success = await assignAttendees(payload);
    if (success) {
      navigate(`/registro-asistencia/ejecucion/${eventId}`);
    }
  };

  return {
    topics,
    rows,
    isLoadingEvent,
    isAssing,
    addEmptyRow,
    updateEmployee,
    toggleEnrollment,
    removeRow,
    saveAssignments,
  };
};
