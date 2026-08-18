import {
  Trash2,
  CheckCircle2,
  Pen,
} from "lucide-react";

import type {
  ChangeEvent,
} from "react";

export type AttendeeTopicDayField =
  | "dayMonday"
  | "dayTuesday"
  | "dayWednesday"
  | "dayThursday"
  | "dayFriday"
  | "daySaturday"
  | "daySunday";


export type AttendeeTopicHoursField =
  | "hoursMonday"
  | "hoursTuesday"
  | "hoursWednesday"
  | "hoursThursday"
  | "hoursFriday"
  | "hoursSaturday"
  | "hoursSunday";

export interface AttendeeTopicEvaluation {
  id: string;

  topicId: number | null;

  dayMonday: boolean;
  dayTuesday: boolean;
  dayWednesday: boolean;
  dayThursday: boolean;
  dayFriday: boolean;
  daySaturday: boolean;
  daySunday: boolean;

  hoursMonday: string;
  hoursTuesday: string;
  hoursWednesday: string;
  hoursThursday: string;
  hoursFriday: string;
  hoursSaturday: string;
  hoursSunday: string;

  totalHours: string;
}

export interface AttendeeEvaluationItem {
  id: string;

  employeeNumber: string;
  name: string;
  line: string;

  shift?: string;
  customerClient?: string;
  unionClassification?: string;
  weldingPercentage?: string;
  diameter?: string;
  machinery?: string;
  ast?: string;

  traineeSignature: unknown;
  supervisorSignature: unknown;

  topics: AttendeeTopicEvaluation[];
}

interface AttendeeRowProps {
  attendee: AttendeeEvaluationItem;

  trainingType: string;

  days: {
    key: AttendeeTopicDayField;
    hoursKey: AttendeeTopicHoursField;
    label: string;
  }[];

  topics: {
    id: number;
    topicCode: string;
    topicName: string;
  }[];

  onChange: (
    id: string,
    e: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >,
  ) => void;

  onTopicDayChange: (
    attendeeId: string,
    topicRowId: string,
    field: AttendeeTopicDayField,
    checked: boolean,
  ) => void;

  onTopicHoursChange: (
    attendeeId: string,
    topicRowId: string,
    field: AttendeeTopicHoursField,
    value: string,
  ) => void;

  onRemove: (
    id: string,
  ) => void;

  onOpenSignature: (
    id: string,
    field:
      | "traineeSignature"
      | "supervisorSignature",
    name: string,
  ) => void;
}

export const AttendeeRow = ({
  attendee,
  trainingType,
  days,
  topics,
  onChange,
  onTopicDayChange,
  onTopicHoursChange,
  onRemove,
  onOpenSignature,
}: AttendeeRowProps) => {
  const rowSpan =
    attendee.topics.length;

  return (
    <>
      {attendee.topics.map(
        (
          topicAssignment,
          topicIndex,
        ) => {
          const isFirstTopic =
            topicIndex === 0;

          const selectedTopic =
            topics.find(
              (topic) =>
                topic.id ===
                topicAssignment.topicId,
            );

          return (
            <tr
              key={topicAssignment.id}
              className="hover:bg-blue-50/30 transition-colors"
            >
              {isFirstTopic && (
                <>
                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-0 bg-slate-50/50 align-middle"
                  >
                    <div className="p-2.5 text-slate-500 font-mono text-xs">
                      {
                        attendee.employeeNumber
                      }
                    </div>
                  </td>

                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-0 bg-slate-50/50 align-middle"
                  >
                    <div className="p-2.5 text-slate-700 font-semibold">
                      {attendee.name}
                    </div>
                  </td>

                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-0 bg-slate-50/50 align-middle"
                  >
                    <div className="p-2.5 text-slate-600 text-xs">
                      {attendee.line}
                    </div>
                  </td>

                  {trainingType ===
                    "FABRICACION" && (
                      <td
                        rowSpan={rowSpan}
                        className="border border-slate-200 p-0 align-middle"
                      >
                        <input
                          type="text"
                          name="shift"
                          value={
                            attendee.shift ||
                            ""
                          }
                          onChange={(e) =>
                            onChange(
                              attendee.id,
                              e,
                            )
                          }
                          className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
                        />
                      </td>
                    )}
                </>
              )}

              {days.map((day) => (
                <td
                  key={day.key}
                  className="border border-slate-200 p-1 text-center align-middle"
                >
                  <div className="flex min-h-16 flex-col items-center justify-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={
                        topicAssignment[
                        day.key
                        ]
                      }
                      onChange={(e) =>
                        onTopicDayChange(
                          attendee.id,
                          topicAssignment.id,
                          day.key,
                          e.target.checked,
                        )
                      }
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded cursor-pointer"
                    />

                    {topicAssignment[
                      day.key
                    ] && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="8"
                            step="0.01"
                            value={
                              topicAssignment[
                              day.hoursKey
                              ]
                            }
                            onChange={(e) =>
                              onTopicHoursChange(
                                attendee.id,
                                topicAssignment.id,
                                day.hoursKey,
                                e.target.value,
                              )
                            }
                            placeholder="0.00"
                            aria-label={
                              `Horas ${day.label}`
                            }
                            className="w-16 rounded-md border border-slate-200 px-1 py-1 text-center text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500"
                          />

                          <span className="text-[10px] text-slate-400">
                            h
                          </span>
                        </div>
                      )}
                  </div>
                </td>
              ))}

              {isFirstTopic &&
                trainingType ===
                "EMPAQUE" && (
                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-0 align-middle"
                  >
                    <input
                      type="text"
                      name="customerClient"
                      value={
                        attendee.customerClient ||
                        ""
                      }
                      onChange={(e) =>
                        onChange(
                          attendee.id,
                          e,
                        )
                      }
                      className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700"
                    />
                  </td>
                )}

              {isFirstTopic &&
                trainingType ===
                "SOLDADURA" && (
                  <>
                    <td
                      rowSpan={rowSpan}
                      className="border border-slate-200 p-0 align-middle"
                    >
                      <input
                        type="text"
                        name="unionClassification"
                        value={
                          attendee.unionClassification ||
                          ""
                        }
                        onChange={(e) =>
                          onChange(
                            attendee.id,
                            e,
                          )
                        }
                        className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700"
                      />
                    </td>

                    <td
                      rowSpan={rowSpan}
                      className="border border-slate-200 p-0 align-middle"
                    >
                      <input
                        type="text"
                        name="weldingPercentage"
                        value={
                          attendee.weldingPercentage ||
                          ""
                        }
                        onChange={(e) =>
                          onChange(
                            attendee.id,
                            e,
                          )
                        }
                        className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
                      />
                    </td>

                    <td
                      rowSpan={rowSpan}
                      className="border border-slate-200 p-0 align-middle"
                    >
                      <input
                        type="text"
                        name="diameter"
                        value={
                          attendee.diameter ||
                          ""
                        }
                        onChange={(e) =>
                          onChange(
                            attendee.id,
                            e,
                          )
                        }
                        className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
                      />
                    </td>
                  </>
                )}

              {isFirstTopic &&
                trainingType ===
                "FABRICACION" && (
                  <>
                    <td
                      rowSpan={rowSpan}
                      className="border border-slate-200 p-0 align-middle"
                    >
                      <input
                        type="text"
                        name="machinery"
                        value={
                          attendee.machinery ||
                          ""
                        }
                        onChange={(e) =>
                          onChange(
                            attendee.id,
                            e,
                          )
                        }
                        className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700"
                      />
                    </td>

                    <td
                      rowSpan={rowSpan}
                      className="border border-slate-200 p-0 align-middle"
                    >
                      <input
                        type="text"
                        name="ast"
                        value={
                          attendee.ast ||
                          ""
                        }
                        onChange={(e) =>
                          onChange(
                            attendee.id,
                            e,
                          )
                        }
                        className="w-full p-2.5 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700 text-center"
                      />
                    </td>
                  </>
                )}

              <td className="border border-slate-200 px-3 py-2 bg-slate-50/30">
                <div
                  className="max-w-56 text-xs font-semibold text-slate-700"
                  title={
                    selectedTopic
                      ?.topicName
                  }
                >
                  {selectedTopic
                    ? `${selectedTopic.topicCode} - ${selectedTopic.topicName}`
                    : "Tema no encontrado"}
                </div>
              </td>

              <td className="border border-slate-200 p-2 text-center align-middle bg-slate-50/40">
                {topicAssignment.totalHours.trim() !== "" ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-bold text-slate-700">
                      {Number(
                        topicAssignment.totalHours,
                      ).toFixed(2)}
                      {" h"}
                    </span>

                    {!(
                      topicAssignment.hoursMonday.trim() !== "" ||
                      topicAssignment.hoursTuesday.trim() !== "" ||
                      topicAssignment.hoursWednesday.trim() !== "" ||
                      topicAssignment.hoursThursday.trim() !== "" ||
                      topicAssignment.hoursFriday.trim() !== "" ||
                      topicAssignment.hoursSaturday.trim() !== "" ||
                      topicAssignment.hoursSunday.trim() !== ""
                    ) && (
                        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-600">
                          Histórico
                        </span>
                      )}
                  </div>
                ) : (
                  <span className="text-slate-300">
                    —
                  </span>
                )}
              </td>

              {isFirstTopic && (
                <>
                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-2 text-center align-middle"
                  >
                    {attendee.traineeSignature ? (
                      <div className="text-emerald-600 flex flex-col items-center gap-1">
                        <CheckCircle2
                          size={18}
                        />
                        <span className="text-[10px] font-bold">
                          Firmado
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenSignature(
                            attendee.id,
                            "traineeSignature",
                            attendee.name,
                          )
                        }
                        className="text-slate-400 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors mx-auto hover:cursor-pointer"
                      >
                        <Pen size={18} />
                        <span className="text-[10px]">
                          Firmar
                        </span>
                      </button>
                    )}
                  </td>

                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-2 text-center align-middle"
                  >
                    {attendee.supervisorSignature ? (
                      <div className="text-emerald-600 flex flex-col items-center gap-1">
                        <CheckCircle2
                          size={18}
                        />
                        <span className="text-[10px] font-bold">
                          Firmado
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenSignature(
                            attendee.id,
                            "supervisorSignature",
                            attendee.name,
                          )
                        }
                        className="text-slate-400 hover:text-blue-600 flex flex-col items-center gap-1 transition-colors mx-auto hover:cursor-pointer"
                      >
                        <Pen size={18} />
                        <span className="text-[10px]">
                          Firmar
                        </span>
                      </button>
                    )}
                  </td>

                  <td
                    rowSpan={rowSpan}
                    className="border border-slate-200 p-0 text-center align-middle bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onRemove(
                          attendee.id,
                        )
                      }
                      className="p-2 text-slate-300 hover:text-rose-600 transition-colors mx-auto block hover:cursor-pointer"
                      title="Eliminar asistente"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </td>
                </>
              )}
            </tr>
          );
        },
      )}
    </>
  );
};