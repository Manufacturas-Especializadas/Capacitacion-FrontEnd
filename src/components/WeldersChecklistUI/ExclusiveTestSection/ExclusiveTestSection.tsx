import { ShieldAlert } from "lucide-react";
import SelectField from "../../Inputs/SelectField";
import InputField from "../../Inputs/InputField";

export interface ExclusiveTestData {
  reference: string;
  result: string;
}

interface ExclusiveTestSectionProps {
  data: ExclusiveTestData;
  onChange: (field: keyof ExclusiveTestData, value: string) => void;
}

export const ExclusiveTestSection = ({
  data,
  onChange,
}: ExclusiveTestSectionProps) => {
  const testOptions = [
    { value: "Sin requerimiento", label: "Sin requerimiento" },
    { value: "Burst test", label: "Burst test" },
    { value: "Capilaridad %", label: "Capilaridad %" },
    { value: "Inmersión PSI", label: "Inmersión PSI" },
  ];

  const isTestRequired = data.reference !== "Sin requerimiento";

  return (
    <div
      className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 
      border-t-4 border-t-orange-500 font-sans"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
        <ShieldAlert className="text-slate-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800 uppercase">
          Pruebas Especiales{" "}
          <span className="text-sm font-normal text-slate-400 capitalize">
            (Opcional)
          </span>
        </h2>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 
        rounded-xl border border-slate-200"
      >
        <div
          className="md:col-span-3 text-xs font-bold text-slate-500 italic border-l-4 
          border-slate-300 pl-3"
        >
          * Prueba exclusiva a requerimiento de C.C y A.C. *
        </div>

        <div className="md:col-span-5 mt-4 md:mt-0">
          <SelectField
            label="Referencia de Prueba"
            name="reference"
            options={testOptions}
            value={data.reference}
            onChange={(e) => {
              onChange("reference", e.target.value);
              if (e.target.value === "Sin requerimiento") {
                onChange("result", "");
              }
            }}
          />
        </div>

        <div className="md:col-span-4 mt-4 md:mt-0">
          <InputField
            label="Resultado"
            name="result"
            value={data.result}
            onChange={(e) => onChange("result", e.target.value)}
            disabled={!isTestRequired}
            className={
              !isTestRequired
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};
