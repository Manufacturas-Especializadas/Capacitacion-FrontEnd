import type { ChangeEvent } from "react";

interface GeneralInfoCardProps {
  formData: {
    leaderNomina: string;
    leaderName: string;
    weekNumber: number;
    trainingType: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTypeSelect: (type: string) => void;
}

const TRAINING_TYPES = ["SOLDADURA", "EMPAQUE", "FABRICACIÓN"];

export const GeneralInfoCard = ({
  formData,
  onChange,
  onTypeSelect,
}: GeneralInfoCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
        Información General
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-600">
            Nómina del Líder
          </label>
          <input
            type="text"
            name="leaderNomina"
            value={formData.leaderNomina}
            onChange={onChange}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 12345"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-600">
            Nombre del Líder
          </label>
          <input
            type="text"
            name="leaderName"
            value={formData.leaderName}
            onChange={onChange}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre completo"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-600">
            No. de Semana (Auto)
          </label>
          <input
            type="number"
            name="weekNumber"
            value={formData.weekNumber}
            readOnly
            className="border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm 
            text-slate-500 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-600">
          Tipo de Entrenamiento Impartido
        </label>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-full md:w-1/2">
          {TRAINING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeSelect(type)}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 hover:cursor-pointer ${
                formData.trainingType === type
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
