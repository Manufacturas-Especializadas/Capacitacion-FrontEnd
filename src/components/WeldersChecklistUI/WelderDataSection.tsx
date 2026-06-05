import type { ChangeEvent } from "react";
import type { WelderData } from "../../types/Types";
import { User } from "lucide-react";
import InputField from "../Inputs/InputField";

interface Props {
  data: WelderData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const WelderDataSection = ({ data, onChange }: Props) => {
  return (
    <div
      className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200
      border-t-4 border-t-orange-500"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
        <User className="text-orange-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800">
          Sección: Datos del Soldador
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <InputField
            label="Nombre del Soldador"
            value={data.name}
            onChange={onChange}
          />
        </div>

        <div className="col-span-1">
          <InputField
            label="N° Nómina"
            value={data.employeeNumber}
            onChange={onChange}
          />
        </div>

        <div className="col-span-1">
          <InputField label="Línea" value={data.line} onChange={onChange} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <InputField
            label="Nombre del Evalaudor"
            value={data.evaluator}
            onChange={onChange}
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <InputField
            type="date"
            label="Fecha de Evaluación"
            value={data.date}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};
