import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  Save,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "sonner";

import { useTrainingTopics } from "../../../hooks/useTrainingTopics";
import { useEmployees } from "../../../hooks/useEmployees";
import {
  useTrainingReportDetails,
  useTrainingReports,
} from "../../../hooks/useTrainingReports";
import { useCatalogs } from "../../../hooks/useCatalogs";

import { AttendeesSection } from "./AttendeesSection";
import { AttendeeSelectionCard } from "./FormUI/AttendeeSelectionCard";
import { GeneralInfoCard } from "./FormUI/GeneralInfoCard";

import type {
  CreateTrainingReportPayload,
  TrainingReportSignatureValue,
  UpdateTrainingReportPayload,
  UpdateWeldingUnionType,
} from "../../../types/Types";

export interface CreateWeldingUnionType {
  listNumber: number;
  unionName: string;
}


interface TrainingReportFormAttendee {
  id: string;

  backendId: number | null;

  employeeNumber: string;
  employeeId: number | null;
  lineId: number | null;
  name: string;
  line: string;

  topicCode: string;
  topicIds: number[];

  dayMonday: boolean;
  dayTuesday: boolean;
  dayWednesday: boolean;
  dayThursday: boolean;
  dayFriday: boolean;
  daySaturday: boolean;
  daySunday: boolean;

  customerClient?: string;
  unionClassification?: string;
  weldingPercentage?: string;
  diameter?: string;
  shift?: string;
  machinery?: string;
  ast?: string;

  traineeSignature:
  TrainingReportSignatureValue;

  supervisorSignature:
  TrainingReportSignatureValue;

  removeTraineeSignature: boolean;
  removeSupervisorSignature: boolean;
}

interface TrainingReportFormState {
  leaderName: string;
  leaderNomina: string;
  weekNumber: number | null;
  trainingType: string;
  observations: string;

  instructorSignature:
  TrainingReportSignatureValue;

  coordinatorSignature:
  TrainingReportSignatureValue;

  safetySignature:
  TrainingReportSignatureValue;

  removeInstructorSignature: boolean;
  removeCoordinatorSignature: boolean;
  removeSecuritySignature: boolean;

  unionTypes: UpdateWeldingUnionType[];
  attendees: TrainingReportFormAttendee[];
}

const normalizeTrainingType = (
  value: string,
): string => {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

const createEmptyAttendee =
  (): TrainingReportFormAttendee => ({
    id: crypto.randomUUID(),
    backendId: null,

    employeeNumber: "",
    employeeId: null,
    lineId: null,
    name: "",
    line: "",

    topicCode: "",
    topicIds: [],

    dayMonday: false,
    dayTuesday: false,
    dayWednesday: false,
    dayThursday: false,
    dayFriday: false,
    daySaturday: false,
    daySunday: false,

    customerClient: "",
    unionClassification: "",
    weldingPercentage: "",
    diameter: "",
    shift: "",
    machinery: "",
    ast: "",

    traineeSignature: null,
    supervisorSignature: null,

    removeTraineeSignature: false,
    removeSupervisorSignature: false,
  });

const getWeekNumber = (d: Date): number => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const TrainingReportsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{
    id?: string;
  }>();

  const isEditMode = id !== undefined;
  const parsedReportId = Number(id);

  const reportId =
    isEditMode &&
      Number.isInteger(parsedReportId) &&
      parsedReportId > 0
      ? parsedReportId
      : null;

  const { topics, fetchTopics } =
    useTrainingTopics();

  const { employees } = useEmployees();

  const {
    createReport,
    updateReport,
    isSubmitting,
  } = useTrainingReports();

  const { lines, fetchLines } =
    useCatalogs();

  const {
    report,
    isLoading: isLoadingReport,
    error: reportError,
  } = useTrainingReportDetails(
    reportId,
    isEditMode,
  );

  const [step, setStep] =
    useState<1 | 2>(1);

  const [loadedReportId, setLoadedReportId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<TrainingReportFormState>({
      leaderName: "",
      leaderNomina: "",
      weekNumber: getWeekNumber(
        new Date(),
      ),
      trainingType: "",
      observations: "",

      instructorSignature: null,
      coordinatorSignature: null,
      safetySignature: null,

      removeInstructorSignature: false,
      removeCoordinatorSignature: false,
      removeSecuritySignature: false,

      unionTypes: [],
      attendees: [],
    });

  useEffect(() => {
    void fetchTopics();
    void fetchLines();
  }, [fetchTopics, fetchLines]);

  useEffect(() => {
    if (
      !isEditMode ||
      !report ||
      loadedReportId === report.id
    ) {
      return;
    }

    setFormData({
      leaderName: report.leaderName,
      leaderNomina: report.leaderPayroll,
      weekNumber: report.weekNumber,

      trainingType:
        normalizeTrainingType(
          report.trainingType,
        ),

      observations:
        report.observations ?? "",

      /*
       * Guardamos las URLs en el estado para que los
       * componentes puedan mostrar las firmas actuales.
       * El servicio no reenviará URLs como archivos.
       */
      instructorSignature:
        report.instructorSignatureUrl,

      coordinatorSignature:
        report.coordinatorSignatureUrl,

      safetySignature:
        report.securitySignatureUrl,

      removeInstructorSignature: false,
      removeCoordinatorSignature: false,
      removeSecuritySignature: false,

      /*
       * El formulario aún no tiene UI para editar uniones,
       * pero las conservamos para evitar eliminarlas.
       */
      unionTypes:
        report.weldingUnionTypes.map(
          (union) => ({
            id: union.id,
            listNumber:
              union.listNumber,
            unionName:
              union.unionName,
          }),
        ),

      attendees: report.attendees.map(
        (attendee) => ({
          /*
           * Este ID se usa en React.
           */
          id: `existing-${attendee.id}`,

          /*
           * Este ID se envía al backend.
           */
          backendId: attendee.id,

          employeeNumber:
            attendee.employeeNumber,

          employeeId:
            attendee.employeeId,

          lineId:
            attendee.lineId,

          name:
            attendee.employeeName,

          line:
            attendee.lineName,

          topicCode:
            attendee.topics[0]
              ?.topicCode ?? "",

          topicIds:
            attendee.topics.map(
              (topic) => topic.id,
            ),

          dayMonday:
            attendee.dayMonday,

          dayTuesday:
            attendee.dayTuesday,

          dayWednesday:
            attendee.dayWednesday,

          dayThursday:
            attendee.dayThursday,

          dayFriday:
            attendee.dayFriday,

          daySaturday:
            attendee.daySaturday,

          daySunday:
            attendee.daySunday,

          customerClient:
            attendee.customerClient ?? "",

          unionClassification:
            attendee.unionClassification ??
            "",

          weldingPercentage:
            attendee.weldingPercentage ??
            "",

          diameter:
            attendee.diameter ?? "",

          shift:
            attendee.shift ?? "",

          machinery:
            attendee.machinery ?? "",

          ast:
            attendee.ast ?? "",

          traineeSignature:
            attendee.traineeSignatureUrl,

          supervisorSignature:
            attendee
              .supervisorSignatureUrl,

          removeTraineeSignature: false,
          removeSupervisorSignature: false,
        }),
      ),
    });

    setLoadedReportId(report.id);
  }, [
    isEditMode,
    report,
    loadedReportId,
  ]);

  const availableTopics = topics.filter(
    (topic) =>
      normalizeTrainingType(
        topic.trainingType,
      ) ===
      normalizeTrainingType(
        formData.trainingType,
      ),
  );

  const topicOptions = availableTopics.map((t) => ({
    value: t.topicCode,
    label: `${t.topicCode} - ${t.topicName}`,
  }));

  const handleMasterChange = (
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >,
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "weekNumber"
          ? value
            ? Number(value)
            : null
          : value,
    }));
  };

  const handleGlobalFieldChange = (
    field: string,
    value: TrainingReportSignatureValue | string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleTypeSelect = (
    selectedType: string,
  ) => {
    const normalizedType =
      normalizeTrainingType(selectedType);

    setFormData((previous) => {
      if (
        previous.trainingType ===
        normalizedType
      ) {
        return previous;
      }

      return {
        ...previous,
        trainingType: normalizedType,

        /*
         * Los temas del tipo anterior ya no serían
         * válidos para el nuevo entrenamiento.
         */
        attendees:
          previous.attendees.map(
            (attendee) => ({
              ...attendee,
              topicCode: "",
              topicIds: [],
            }),
          ),
      };
    });
  };

  const addAttendeeRow = () => {
    setFormData((previous) => ({
      ...previous,
      attendees: [
        ...previous.attendees,
        createEmptyAttendee(),
      ],
    }));
  };

  const removeAttendeeRow = (
    idToRemove: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      attendees:
        previous.attendees.filter(
          (attendee) =>
            attendee.id !== idToRemove,
        ),
    }));
  };

  const handleAttendeeFileChange = (
    idToUpdate: string,
    field: string,
    signature:
      TrainingReportSignatureValue,
  ) => {
    setFormData((previous) => ({
      ...previous,
      attendees:
        previous.attendees.map(
          (attendee) =>
            attendee.id === idToUpdate
              ? {
                ...attendee,
                [field]: signature,
              }
              : attendee,
        ),
    }));
  };

  const handleAttendeeChange = (
    idToUpdate: string,
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >,
  ) => {
    const target = event.target;

    const fieldValue =
      target instanceof HTMLInputElement &&
        target.type === "checkbox"
        ? target.checked
        : target.value;

    const fieldName = target.name;

    setFormData((previous) => {
      const updatedAttendees =
        previous.attendees.map(
          (attendee) => {
            if (
              attendee.id !== idToUpdate
            ) {
              return attendee;
            }

            const updatedAttendee = {
              ...attendee,
              [fieldName]: fieldValue,
            };

            if (
              fieldName === "topicCode"
            ) {
              const selectedTopic =
                topics.find(
                  (topic) =>
                    topic.topicCode ===
                    String(fieldValue) &&
                    normalizeTrainingType(
                      topic.trainingType,
                    ) ===
                    normalizeTrainingType(
                      previous.trainingType,
                    ),
                );

              updatedAttendee.topicIds =
                selectedTopic
                  ? [selectedTopic.id]
                  : [];
            }

            if (
              fieldName ===
              "employeeNumber"
            ) {
              const searchValue =
                String(
                  fieldValue,
                ).trim();

              const employee =
                employees?.find(
                  (currentEmployee) =>
                    String(
                      currentEmployee
                        .employeeNumber,
                    ).trim() ===
                    searchValue,
                );

              if (employee) {
                updatedAttendee.name =
                  employee.name ?? "";

                updatedAttendee.employeeId =
                  Number(employee.id);

                if (employee.line) {
                  const employeeLine =
                    String(employee.line)
                      .trim()
                      .toLowerCase();

                  const line =
                    lines?.find(
                      (currentLine) => {
                        const lineName = String(
                          currentLine.name ?? "",
                        )
                          .trim()
                          .toLowerCase();

                        return (
                          lineName ===
                          employeeLine
                        );
                      },
                    );

                  updatedAttendee.lineId =
                    line
                      ? Number(line.id)
                      : null;

                  updatedAttendee.line = line
                    ? line.name
                    : String(employee.line);
                }
              } else {
                updatedAttendee.name = "";
                updatedAttendee.line = "";
                updatedAttendee.lineId =
                  null;

                updatedAttendee.employeeId =
                  null;
              }
            }

            return updatedAttendee;
          },
        );

      return {
        ...previous,
        attendees:
          updatedAttendees,
      };
    });
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const invalidAttendee =
      formData.attendees.find(
        (attendee) =>
          attendee.employeeId === null ||
          attendee.employeeId <= 0 ||
          attendee.lineId === null ||
          attendee.lineId <= 0 ||
          attendee.topicIds.length === 0,
      );

    if (invalidAttendee) {
      toast.error(
        `Verifica los datos del asistente ${invalidAttendee.employeeNumber || "sin nómina"
        }. Debe tener empleado, línea y tema válidos.`,
      );

      return;
    }

    const commonAttendees =
      formData.attendees.map((attendee) => ({
        employeeId: Number(attendee.employeeId),
        lineId: Number(attendee.lineId),

        dayMonday: attendee.dayMonday,
        dayTuesday: attendee.dayTuesday,
        dayWednesday: attendee.dayWednesday,
        dayThursday: attendee.dayThursday,
        dayFriday: attendee.dayFriday,
        daySaturday: attendee.daySaturday,
        daySunday: attendee.daySunday,

        customerClient: attendee.customerClient,
        unionClassification:
          attendee.unionClassification,
        weldingPercentage:
          attendee.weldingPercentage,
        diameter: attendee.diameter,
        shift: attendee.shift,
        machinery: attendee.machinery,
        ast: attendee.ast,

        topicIds: attendee.topicIds,

        traineeSignature:
          attendee.traineeSignature,

        supervisorSignature:
          attendee.supervisorSignature,
      }));

    let success = false;

    if (isEditMode) {
      if (reportId === null) {
        toast.error(
          "El identificador del reporte no es válido.",
        );

        return;
      }

      const updatePayload:
        UpdateTrainingReportPayload = {
        trainingType:
          normalizeTrainingType(
            formData.trainingType,
          ),

        leaderName:
          formData.leaderName,

        leaderPayroll:
          formData.leaderNomina,

        weekNumber:
          formData.weekNumber,

        observations:
          formData.observations,

        instructorSignature:
          formData
            .instructorSignature,

        coordinatorSignature:
          formData
            .coordinatorSignature,

        securitySignature:
          formData.safetySignature,

        removeInstructorSignature:
          formData
            .removeInstructorSignature,

        removeCoordinatorSignature:
          formData
            .removeCoordinatorSignature,

        removeSecuritySignature:
          formData
            .removeSecuritySignature,

        unionTypes:
          formData.unionTypes,

        attendees:
          formData.attendees.map(
            (attendee, index) => ({
              ...commonAttendees[index],

              id:
                attendee.backendId ??
                undefined,

              removeTraineeSignature:
                attendee
                  .removeTraineeSignature,

              removeSupervisorSignature:
                attendee
                  .removeSupervisorSignature,
            }),
          ),
      };

      success = await updateReport(
        reportId,
        updatePayload,
      );
    } else {
      const createPayload:
        CreateTrainingReportPayload = {
        trainingType:
          normalizeTrainingType(
            formData.trainingType,
          ),

        leaderName:
          formData.leaderName,

        leaderPayroll:
          formData.leaderNomina,

        weekNumber:
          formData.weekNumber,

        observations:
          formData.observations,

        instructorSignature:
          formData
            .instructorSignature,

        coordinatorSignature:
          formData
            .coordinatorSignature,

        securitySignature:
          formData.safetySignature,

        unionTypes:
          formData.unionTypes.map(
            (union) => ({
              listNumber:
                union.listNumber,
              unionName:
                union.unionName,
            }),
          ),

        attendees:
          commonAttendees,
      };

      success = await createReport(
        createPayload,
      );
    }

    if (success) {
      navigate(
        "/reportes-entrenamientos",
      );
    }
  };

  const isStep1Complete = Boolean(
    formData.trainingType &&
    formData.attendees.length > 0 &&
    formData.attendees.every(
      (attendee) =>
        attendee.employeeNumber.trim() !== "" &&
        attendee.employeeId !== null &&
        attendee.employeeId > 0 &&
        attendee.lineId !== null &&
        attendee.lineId > 0 &&
        attendee.topicCode.trim() !== "" &&
        attendee.topicIds.length > 0,
    ),
  );

  if (
    isEditMode &&
    isLoadingReport
  ) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-3 text-slate-500">
        <Loader2
          size={28}
          className="animate-spin text-blue-600"
        />

        <span className="font-semibold">
          Cargando reporte...
        </span>
      </div>
    );
  }

  if (
    isEditMode &&
    reportError
  ) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={22}
              className="shrink-0"
            />

            <div>
              <h2 className="font-bold">
                No se pudo cargar el reporte
              </h2>

              <p className="mt-1 text-sm">
                {reportError}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/reportes-entrenamientos",
              )
            }
            className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm hover:cursor-pointer"
          >
            Regresar
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-slate-800">
            {step === 1
              ? isEditMode
                ? `Editar Reporte #${reportId}`
                : "Nuevo Reporte de Entrenamiento"
              : isEditMode
                ? "Actualizar Asistencia y Evidencias"
                : "Registro de Asistencia y Evidencias"}
          </h1>
        </div>

        <div className="flex gap-2 text-sm font-bold">
          <span className={step === 1 ? "text-blue-600" : "text-slate-400"}>
            1. Selección
          </span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? "text-blue-600" : "text-slate-400"}>
            2. Evaluación
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <>
            <GeneralInfoCard
              formData={formData}
              onChange={handleMasterChange}
              onTypeSelect={handleTypeSelect}
            />
            <AttendeeSelectionCard
              trainingType={formData.trainingType}
              attendees={formData.attendees}
              topicOptions={topicOptions}
              onAdd={addAttendeeRow}
              onRemove={removeAttendeeRow}
              onChange={handleAttendeeChange}
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/reportes-entrenamientos")}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 
                hover:bg-slate-100 rounded-lg transition-colors hover:cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!isStep1Complete}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 
                hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex 
                items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed 
                hover:cursor-pointer"
              >
                Continuar a Evaluación <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <AttendeesSection
              trainingType={formData.trainingType}
              attendees={formData.attendees}
              topics={availableTopics}
              onRemove={removeAttendeeRow}
              onChange={handleAttendeeChange}
              onSignatureChange={handleAttendeeFileChange}
              observations={formData.observations}
              instructorSignature={formData.instructorSignature}
              coordinatorSignature={formData.coordinatorSignature}
              safetySignature={formData.safetySignature}
              onGlobalFieldChange={handleGlobalFieldChange}
            />

            <div className="flex justify-between gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 
                hover:bg-slate-100 rounded-lg transition-colors hover:cursor-pointer 
                flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowLeft size={18} /> Volver a Selección
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg 
                    shadow-sm transition-all flex items-center gap-2 hover:cursor-pointer ${isSubmitting
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-slate-800 hover:bg-slate-900 active:scale-95"
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    {isEditMode
                      ? "Actualizando..."
                      : "Procesando..."}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {isEditMode
                      ? "Actualizar Reporte"
                      : "Guardar Reporte Final"}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
