import { Layers } from "lucide-react";
import type { UnionEvaluationItem } from "../../../types/Types";

interface Props {
  items: UnionEvaluationItem[];
  onUpdateAnswer: (id: string, answer: string) => void;
  onUpdateScore: (id: string, score: number | null) => void;
}

export const UnionEvaluationSection = ({
  items,
  onUpdateAnswer,
  onUpdateScore,
}: Props) => {
  let totalEvaluated = 0;
  let obtainedScore = 0;

  items.forEach((item) => {
    if (item.score !== null) {
      totalEvaluated++;
      obtainedScore += item.score;
    }
  });

  const maxPossibleScore = items.length * 100;
  const sectionGrade = totalEvaluated > 0 ? obtainedScore / totalEvaluated : 0;
  return (
    <div
      className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 
      border-t-4 border-t-orange-500 font-sans"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
        <Layers className="text-orange-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800 uppercase">
          Unión a Evaluar
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-300">
        <table className="w-full text-sm text-left">
          <thead
            className="bg-slate-100 text-slate-600 uppercase font-bold border-b 
          border-slate-300 text-xs hidden md:table-header-group"
          >
            <tr>
              <th className="p-3 w-1/4 border-r border-slate-300">
                Especificación
              </th>
              <th className="p-3 w-1/2 border-r border-slate-300 text-center"></th>
              <th className="p-3 w-1/4 text-center">Nivel de Dominio</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors flex flex-col md:table-row"
              >
                <td
                  className="p-3 font-semibold text-slate-700 md:border-r 
                  md:border-slate-300 bg-slate-50/50 md:bg-transparent text-right 
                  md:text-left align-middle"
                >
                  {item.attribute}
                </td>

                <td className="p-2 md:p-3 md:border-r md:border-slate-300">
                  <input
                    type="text"
                    value={item.answer}
                    onChange={(e) => onUpdateAnswer(item.id, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md 
                    text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 
                    focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </td>

                <td className="p-2 md:p-3 align-middle">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.score ?? ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? null : Number(e.target.value);
                      onUpdateScore(item.id, val);
                    }}
                    className="w-full md:w-32 mx-auto block px-3 py-2 border 
                    border-slate-300 rounded-md text-sm text-center font-bold 
                    text-slate-800 bg-white focus:outline-none focus:ring-1 
                    focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="bg-slate-200/60 p-4 border-t border-slate-300 flex flex-col 
          items-end gap-2"
        >
          <div className="flex justify-between w-full md:w-80">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Puntaje Obtenido:
            </span>
            <span className="text-sm font-black text-slate-800">
              {obtainedScore}{" "}
              <span className="text-slate-500 font-medium text-xs">
                / {maxPossibleScore}
              </span>
            </span>
          </div>
          <div className="flex justify-between w-full md:w-80">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Calificación:
            </span>
            <span className="text-sm font-black text-slate-800">
              {sectionGrade.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
