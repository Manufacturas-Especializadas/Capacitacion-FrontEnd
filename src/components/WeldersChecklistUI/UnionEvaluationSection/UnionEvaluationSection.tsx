import type { UnionEvaluationItem } from "../../../types/Types";
import { Layers } from "lucide-react";

interface Props {
  items: UnionEvaluationItem[];
  previousSectionScore: number;
  previousSectionQuestionsCount: number;
  onUpdateAnswer: (id: string, answer: string) => void;
  onUpdateScore: (id: string, score: number | null) => void;
}

export const UnionEvaluationSection = ({
  items,
  previousSectionScore,
  previousSectionQuestionsCount,
  onUpdateAnswer,
  onUpdateScore,
}: Props) => {
  const evaluableItems = items.filter(
    (item) => !item.attribute.toLowerCase().includes("clasificaci"),
  );

  const evaluableCount = evaluableItems.length;
  let obtainedScore = 0;

  evaluableItems.forEach((item) => {
    if (item.score !== null) {
      obtainedScore += item.score;
    }
  });

  const maxPossibleScore = evaluableCount * 4;
  const sectionGrade =
    maxPossibleScore > 0 ? (obtainedScore * 100) / maxPossibleScore : 0;
  const finalScore = evaluableCount > 0 ? obtainedScore / evaluableCount : 0;

  const totalPoints = previousSectionScore + obtainedScore;
  const totalQuestions = previousSectionQuestionsCount + evaluableCount;
  const masteryLevel = totalQuestions > 0 ? totalPoints / totalQuestions : 0;

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
            {items.map((item) => {
              const isClasificacion = item.attribute
                .toLowerCase()
                .includes("clasificaci");

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors flex flex-col 
                  md:table-row"
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
                    {!isClasificacion ? (
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={item.score ?? ""}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value);
                          onUpdateScore(item.id, val);
                        }}
                        className="w-full md:w-32 mx-auto block px-3 py-2 border 
                      border-slate-300 rounded-md text-sm text-center font-bold 
                      text-slate-800 bg-white focus:outline-none focus:ring-1 
                      focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    ) : (
                      <div className="w-full text-center text-xs text-slate-400 italic">
                        No evaluable
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          className="bg-slate-200/60 p-6 border-t border-slate-300 grid grid-cols-1 
          sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Puntaje Obtenido
            </span>
            <span className="text-xl font-black text-slate-800">
              {obtainedScore}{" "}
              <span className="text-sm font-medium text-slate-500">
                / {maxPossibleScore}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Calificación
            </span>
            <span className="text-xl font-black text-slate-800">
              {sectionGrade.toFixed(1)}{" "}
              <span className="text-sm font-medium text-slate-500">/ 100</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Puntaje Final
            </span>
            <span className="text-xl font-black text-orange-600">
              {finalScore.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-300 sm:pl-6 pt-4 sm:pt-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Puntos Totales (Global)
            </span>
            <span className="text-xl font-black text-slate-800">
              {totalPoints}{" "}
              <span className="text-sm font-medium text-slate-500">pts</span>
            </span>
          </div>

          <div className="flex flex-col pt-4 sm:pt-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Nivel de Dominio
            </span>
            <span className="text-xl font-black text-blue-600">
              {masteryLevel.toFixed(2)}{" "}
              <span className="text-sm font-medium text-slate-500">/ 4.0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
