import type { ChangeEvent } from "react";
import type { ProductionLines, WelderData } from "../../types/Types";
import { Info, User } from "lucide-react";
import InputField from "../Inputs/InputField";
import SelectField from "../Inputs/SelectField";

interface Props {
  data: WelderData;
  productionLines: ProductionLines[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const WelderDataSection = ({
  data,
  onChange,
  productionLines,
}: Props) => {
  const lineOptions = [
    { value: "", label: "Selecciona una línea..." },
    ...productionLines.map((line: any) => ({
      value: line.id ? line.id.toString() : line.lineName,
      label: line.lineName || line.name || `Línea ${line.id}`,
    })),
  ];

  const rubricLevels = [
    {
      title: "Principiante",
      description:
        "El colaborador ha presenciado la operación, se encuentra en fase de entrenamiento.",
      score: 1,
    },
    {
      title: "Básico",
      description: "El colaborador ha realizado la operación bajo supervisión.",
      score: 2,
    },
    {
      title: "Intermedio",
      description:
        "El colaborador ha sido certificado en la realización de esta operación, cumple con aspectos de seguridad y calidad al realizar la operación.",
      score: 3,
    },
    {
      title: "Avanzado",
      description:
        "El colaborador ha sido certificado en la realización de esta operación, además de tener la habilidad de soldar 2 o más tipos de unión.",
      score: 4,
    },
  ];

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              label="Nombre del Soldador"
              name="name"
              value={data.name}
              onChange={onChange}
            />
          </div>

          <div className="col-span-1">
            <InputField
              label="N° Nómina"
              name="employeeNumber"
              value={data.employeeNumber}
              onChange={onChange}
            />
          </div>

          <div className="col-span-1">
            <SelectField
              label="Línea"
              name="line"
              value={data.line}
              onChange={onChange}
              options={lineOptions}
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <InputField
              label="Nombre del Evaluador"
              name="evaluator"
              value={data.evaluator}
              onChange={onChange}
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <InputField
              type="date"
              label="Fecha de Evaluación"
              name="date"
              value={data.date}
              onChange={onChange}
            />
          </div>
        </div>

        <div
          className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 w-full h-full 
          flex flex-col"
        >
          <div className="flex items-center gap-2 mb-5 justify-center text-slate-700">
            <Info size={18} className="text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Evalúe de acuerdo al dominio de la habilidad
            </h3>
          </div>

          <div
            className="overflow-hidden rounded-xl border border-slate-200 bg-white 
            shadow-sm grow"
          >
            <table className="w-full text-left border-collapse h-full">
              <tbody className="divide-y divide-slate-100">
                {rubricLevels.map((level, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <th
                      className="bg-slate-50/80 text-slate-600 font-black uppercase text-[10px] 
                      tracking-widest px-4 py-4 border-r border-slate-100 w-1/4 align-middle"
                    >
                      {level.title}
                    </th>
                    <td className="px-4 py-4 border-r border-slate-100 text-xs text-slate-600 leading-relaxed align-middle">
                      {level.description}
                    </td>
                    <td className="px-4 py-4 w-20 text-center align-middle">
                      {/* Indicador circular para la calificación */}
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full 
                        bg-slate-100 text-slate-500 font-black text-sm group-hover:bg-blue-100 
                        group-hover:text-blue-700 transition-colors"
                      >
                        {level.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
