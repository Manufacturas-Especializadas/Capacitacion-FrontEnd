import { ClipboardCheck, Trash2, PlusCircle } from "lucide-react";
import type { PracticalSectionData } from "../../../types/Types";

interface Props {
  sections: PracticalSectionData[];
  onUpdateScore: (sectionId: string, questionId: string, score: number) => void;
  onUpdateQuestionText: (
    sectionId: string,
    questionId: string,
    text: string,
  ) => void;
  onAddQuestion: (sectionId: string) => void;
  onRemoveQuestion: (sectionId: string, questionId: string) => void;
}

export const PracticalEvaluationSection = ({
  sections,
  onUpdateScore,
  onUpdateQuestionText,
  onAddQuestion,
  onRemoveQuestion,
}: Props) => {
  let totalQuestions = 0;
  let obtainedScore = 0;

  sections.forEach((sec) => {
    sec.questions.forEach((q) => {
      totalQuestions++;
      if (q.score !== null) {
        obtainedScore += q.score;
      }
    });
  });

  const maxPossibleScore = totalQuestions * 4;

  const grade =
    maxPossibleScore > 0 ? (obtainedScore * 100) / maxPossibleScore : 0;
  return (
    <div
      className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 
      border-t-4 border-t-orange-500 font-sans"
    >
      <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-3">
        <ClipboardCheck className="text-orange-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800">
          Evaluación Práctica
        </h2>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden"
          >
            <div
              className="bg-slate-200/50 p-3 border-b border-slate-200 flex 
              justify-between items-center"
            >
              <h3
                className="text-xs md:text-sm font-black text-slate-600 uppercase 
                tracking-wider"
              >
                {section.title}
              </h3>
              <div className="hidden md:flex gap-4 pr-2 text-xs font-bold text-slate-400">
                <span className="w-10 text-center">1</span>
                <span className="w-10 text-center">2</span>
                <span className="w-10 text-center">3</span>
                <span className="w-10 text-center">4</span>
              </div>
            </div>

            <div className="p-2 md:p-4 space-y-2">
              {section.questions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex flex-col md:flex-row md:items-center justify-between 
                  gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm 
                  hover:border-orange-200 transition-colors group"
                >
                  <div className="flex items-start gap-2 grow">
                    <span className="text-sm font-bold text-slate-400 pt-2">
                      {index + 1}.
                    </span>
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={(e) =>
                        onUpdateQuestionText(section.id, q.id, e.target.value)
                      }
                      placeholder="Escribe la pregunta..."
                      className="w-full bg-transparent border-none focus:ring-0 p-2 text-sm 
                      text-slate-700 font-medium placeholder:text-slate-300 resize-none 
                      outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
                    {[1, 2, 3, 4].map((val) => {
                      const isSelected = q.score === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => onUpdateScore(section.id, q.id, val)}
                          className={`
                            w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-sm rounded-md transition-colors duration-200 ease-in-out cursor-pointer font-bold
                            focus:outline-none focus:ring-1 focus:ring-orange-600
                            ${
                              isSelected
                                ? "bg-orange-50 border border-orange-500 text-orange-700 ring-1 ring-orange-500"
                                : "bg-white border border-gray-300 text-gray-500 hover:border-orange-400 hover:text-orange-600"
                            }
                          `}
                        >
                          {val}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => onRemoveQuestion(section.id, q.id)}
                      className="ml-2 p-2 text-slate-300 hover:text-rose-500 
                      hover:bg-rose-50 rounded-lg transition-colors md:opacity-0 
                      group-hover:opacity-100 cursor-pointer"
                      title="Eliminar pregunta"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => onAddQuestion(section.id)}
                className="mt-2 text-sm font-bold text-orange-600 flex items-center gap-1.5 
                px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <PlusCircle size={16} /> Agregar pregunta a esta sección
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-8 bg-slate-400/10 rounded-xl p-6 border border-slate-300 flex 
        flex-col md:flex-row justify-end items-center gap-8"
      >
        <div className="text-center md:text-right">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">
            Puntaje Obtenido:
          </p>
          {/* <p className="text-2xl font-black text-slate-800">
            {obtainedScore}{" "}
            <span className="text-sm font-medium text-slate-500">
              / {maxPossibleScore}
            </span>
          </p> */}
          <p className="text-2xl font-black text-slate-800">
            {maxPossibleScore}
          </p>
        </div>

        <div className="hidden md:block w-px h-12 bg-slate-300" />

        <div className="text-center md:text-right">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">
            Calificación:
          </p>
          <p className="text-3xl font-black text-slate-900">
            {grade.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
};
