import { useState, type ChangeEvent } from "react";
import { AttendeesTableHeader } from "./AttendeesSectionUI/AttendeesTableHeader";
import {
  AttendeeRow,
  type AttendeeEvaluationItem,
  type AttendeeDayField,
  type AttendeeHoursField,
} from "./AttendeesSectionUI/AttendeeRow";
import { SignatureModal } from "../../../components/SignatureModal/SignatureModal";
import { ReportFooterSection } from "./AttendeesSectionUI/ReportFooterSection";

interface AttendeesSectionProps {
  trainingType: string;
  attendees: AttendeeEvaluationItem[];

  topics: {
    id: number;
    topicCode: string;
    topicName: string;
  }[];

  onDayChange: (
    attendeeId: string,
    field: AttendeeDayField,
    checked: boolean,
  ) => void;

  onHoursChange: (
    attendeeId: string,
    field: AttendeeHoursField,
    value: string,
  ) => void;

  onRemove: (id: string) => void;
  onChange: (
    id: string,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSignatureChange: (id: string, field: string, signature: any) => void;
  observations: string;
  instructorSignature: any;
  coordinatorSignature: any;
  safetySignature: any;
  onGlobalFieldChange: (field: string, value: any) => void;
}

export const AttendeesSection = ({
  trainingType,
  attendees,
  topics,
  onRemove,
  onChange,
  onSignatureChange,
  observations,
  instructorSignature,
  coordinatorSignature,
  safetySignature,
  onGlobalFieldChange,
  onDayChange,
  onHoursChange,
}: AttendeesSectionProps) => {

  const days: {
    key: AttendeeDayField;
    hoursKey: AttendeeHoursField;
    label: string;
  }[] = [
      {
        key: "dayMonday",
        hoursKey: "hoursMonday",
        label: "L",
      },
      {
        key: "dayTuesday",
        hoursKey: "hoursTuesday",
        label: "M",
      },
      {
        key: "dayWednesday",
        hoursKey: "hoursWednesday",
        label: "M",
      },
      {
        key: "dayThursday",
        hoursKey: "hoursThursday",
        label: "J",
      },
      {
        key: "dayFriday",
        hoursKey: "hoursFriday",
        label: "V",
      },
      {
        key: "daySaturday",
        hoursKey: "hoursSaturday",
        label: "S",
      },
      {
        key: "daySunday",
        hoursKey: "hoursSunday",
        label: "D",
      },
    ];

  const [modalOpen, setModalOpen] = useState(false);

  const [activeSignature, setActiveSignature] = useState<{
    id: string | null;
    field: string;
    label: string;
  } | null>(null);

  const handleOpenRowSignature = (
    id: string,
    field: "traineeSignature" | "supervisorSignature",
    name: string,
  ) => {
    const roleLabel =
      field === "traineeSignature"
        ? "Firma del Colaborador"
        : "Firma del Supervisor";
    setActiveSignature({ id, field, label: `${roleLabel} - ${name}` });
    setModalOpen(true);
  };

  const handleOpenGlobalSignature = (field: string, label: string) => {
    setActiveSignature({ id: null, field, label });
    setModalOpen(true);
  };

  const handleSaveSignature = (signatureData: any) => {
    if (activeSignature) {
      if (activeSignature.id) {
        onSignatureChange(
          activeSignature.id,
          activeSignature.field,
          signatureData,
        );
      } else {
        onGlobalFieldChange(activeSignature.field, signatureData);
      }
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Cuadrícula de Asistencia y Evaluación
        </h3>
      </div>

      <div className="max-h-[70vh] overflow-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-max border-collapse text-sm text-left">
          <AttendeesTableHeader trainingType={trainingType} days={days} />

          <tbody className="bg-white">
            {attendees.map(
              (attendee, index) => (
                <AttendeeRow
                  key={attendee.id || index}
                  attendee={attendee}
                  trainingType={trainingType}
                  days={days}
                  topics={topics}
                  onChange={onChange}
                  onDayChange={onDayChange}
                  onHoursChange={onHoursChange}
                  onRemove={onRemove}
                  onOpenSignature={
                    handleOpenRowSignature
                  }
                />
              ),
            )}
          </tbody>
        </table>

        {attendees.length === 0 && (
          <div className="p-8 text-center text-slate-400 bg-slate-50/50">
            Regresa al paso anterior para agregar colaboradores a la evaluación.
          </div>
        )}
      </div>

      <ReportFooterSection
        observations={observations}
        instructorSignature={instructorSignature}
        coordinatorSignature={coordinatorSignature}
        safetySignature={safetySignature}
        onChangeObservations={(val) => onGlobalFieldChange("observations", val)}
        onOpenSignature={handleOpenGlobalSignature}
      />

      <SignatureModal
        isOpen={modalOpen}
        title={activeSignature?.label || "Firma"}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
};
