import { Pen, CheckCircle2 } from "lucide-react";

interface ReportFooterSectionProps {
  observations: string;
  instructorSignature: any;
  coordinatorSignature: any;
  safetySignature: any;
  onChangeObservations: (value: string) => void;
  onOpenSignature: (
    field: "instructorSignature" | "coordinatorSignature" | "safetySignature",
    label: string,
  ) => void;
}

export const ReportFooterSection = ({
  observations,
  instructorSignature,
  coordinatorSignature,
  safetySignature,
  onChangeObservations,
  onOpenSignature,
}: ReportFooterSectionProps) => {
  const renderSignatureBox = (
    field: "instructorSignature" | "coordinatorSignature" | "safetySignature",
    label: string,
    signatureValue: any,
  ) => (
    <div
      className="flex flex-col items-center justify-center p-5 border border-slate-200 
      rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
    >
      <span
        className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider 
        mb-2"
      >
        {label}
      </span>
      {signatureValue ? (
        <div className="text-emerald-600 flex flex-col items-center gap-1 mt-2">
          <CheckCircle2 size={28} />
          <span className="text-xs font-bold">Firmado</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onOpenSignature(field, label)}
          className="text-slate-400 hover:text-blue-600 flex flex-col items-center 
          gap-1 transition-colors mt-2 hover:cursor-pointer"
        >
          <Pen size={28} />
          <span className="text-xs font-semibold">Firmar</span>
        </button>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col gap-6 p-6 bg-white border border-slate-200 rounded-xl 
      shadow-sm mt-6"
    >
      <h3
        className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b 
        border-slate-100 pb-2"
      >
        Cierre del Reporte
      </h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-600">
          Observaciones
        </label>
        <textarea
          value={observations}
          onChange={(e) => onChangeObservations(e.target.value)}
          className="w-full border border-slate-200 rounded-lg p-3 text-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none 
          bg-slate-50"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSignatureBox(
          "instructorSignature",
          "Firma del Instructor Responsable",
          instructorSignature,
        )}
        {renderSignatureBox(
          "coordinatorSignature",
          "Firma Coord. de Capacitación",
          coordinatorSignature,
        )}
        {renderSignatureBox(
          "safetySignature",
          "Firma Responsable de Seguridad",
          safetySignature,
        )}
      </div>
    </div>
  );
};
