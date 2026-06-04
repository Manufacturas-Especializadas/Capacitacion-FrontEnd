import { PenTool } from "lucide-react";

interface SignaturesSectionProps {
  signatures: Record<string, string>;
  onOpenModal: (id: string, label: string) => void;
}

export const SignaturesSection = ({
  signatures,
  onOpenModal,
}: SignaturesSectionProps) => {
  const SignatureBlock = ({ id, label }: { id: string; label: string }) => (
    <div className="flex flex-col items-center justify-end w-full">
      <div
        className="w-full max-w-70 border-b border-slate-800 mb-2 h-20 flex items-end justify-center pb-1 relative group cursor-pointer"
        onClick={() => onOpenModal(id, label)}
      >
        {signatures[id] ? (
          <img
            src={signatures[id]}
            alt={`Firma ${label}`}
            className="h-16 object-contain"
          />
        ) : (
          <span
            className="text-slate-400 text-sm mb-2 group-hover:text-orange-600 
            transition-colors"
          >
            Clic para firmar
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
        {label}
      </p>
    </div>
  );

  return (
    <div
      className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 
      border-t-4 border-t-orange-500 font-sans"
    >
      <div className="flex items-center gap-2 mb-10 border-b border-slate-100 pb-3">
        <PenTool className="text-slate-800" size={24} />
        <h2 className="text-xl font-bold text-slate-800 uppercase">Firmas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-12">
        <div className="space-y-10">
          <SignatureBlock id="colaborador" label="Colaborador evaluado" />
          <SignatureBlock id="coordinadorArea" label="Coordinador de área" />
          <SignatureBlock
            id="coordCapacitacion"
            label="Coord. De Capacitación"
          />
        </div>

        <div className="space-y-10 md:pt-0">
          <SignatureBlock id="supervisor" label="Supervisor de área" />
          <SignatureBlock id="evaluador" label="Evaluador" />
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row justify-between items-center pt-6 border-t 
        border-slate-200 text-[10px] text-slate-400 font-medium uppercase 
        tracking-wider gap-2"
      >
        <span>Manufacturas Especializadas</span>
        <span>FO-RH-10</span>
      </div>
    </div>
  );
};
