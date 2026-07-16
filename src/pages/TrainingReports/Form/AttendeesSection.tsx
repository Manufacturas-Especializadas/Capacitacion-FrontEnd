import { useState, type ChangeEvent } from "react";
import { AttendeesTableHeader } from "./AttendeesSectionUI/AttendeesTableHeader";
import { AttendeeRow } from "./AttendeesSectionUI/AttendeeRow";
import { SignatureModal } from "../../../components/SignatureModal/SignatureModal";
import { ReportFooterSection } from "./AttendeesSectionUI/ReportFooterSection";

interface AttendeesSectionProps {
  trainingType: string;
  attendees: any[];
  topics: any[];
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
}: AttendeesSectionProps) => {
  const hasSunday =
    trainingType === "SOLDADURA" || trainingType === "FABRICACION";
  const days = [
    { key: "dayMonday", label: "L" },
    { key: "dayTuesday", label: "M" },
    { key: "dayWednesday", label: "M" },
    { key: "dayThursday", label: "J" },
    { key: "dayFriday", label: "V" },
    { key: "daySaturday", label: "S" },
    ...(hasSunday ? [{ key: "daySunday", label: "D" }] : []),
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

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-max border-collapse text-sm text-left">
          <AttendeesTableHeader trainingType={trainingType} days={days} />

          <tbody className="bg-white">
            {attendees.map((attendee, index) => {
              const selectedTopic = topics.find(
                (t) => t.topicCode === attendee.topicCode,
              );

              return (
                <AttendeeRow
                  key={attendee.id || index}
                  attendee={attendee}
                  trainingType={trainingType}
                  days={days}
                  topicName={selectedTopic?.topicName}
                  onChange={onChange}
                  onRemove={onRemove}
                  onOpenSignature={handleOpenRowSignature}
                />
              );
            })}
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
