import { useEffect, useState, type SyntheticEvent } from "react";
import { Save, AlertCircle, Loader2 } from "lucide-react";
import type {
  Form,
  Tutors,
  ProductionLines,
  FollowUpWeeks,
  Question,
  Option,
} from "../../../types/Types";
import InputField from "../../Inputs/InputField";
import SelectField from "../../Inputs/SelectField";
import { TextareaField } from "../../Inputs/TextareaField";
import { useLocation, useNavigate } from "react-router-dom";
import { useTutoringPrograms } from "../../../hooks/useTutoringPrograms";

interface DynamicFormProps {
  sections: Form[];
  isReadOnly?: boolean;
  initialAnswers?: Record<number, any>;
  programId?: number;
  catalogs: {
    tutors: Tutors[];
    lines: ProductionLines[];
    weeks: FollowUpWeeks[];
  };
  onCancel: () => void;
}

export const DynamicForm = ({
  sections,
  catalogs,
  isReadOnly,
  programId,
  onCancel,
}: DynamicFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createProgram, updateProgram, getProgramById, isSubmitting } =
    useTutoringPrograms();

  const prefillData = location.state?.prefillData;

  const nextWeekId =
    prefillData && prefillData.weekId < 4
      ? (prefillData.weekId + 1).toString()
      : "";

  const [generalData, setGeneralData] = useState({
    tutorId: prefillData ? prefillData.tutorId.toString() : "",
    collaboratorName: prefillData ? prefillData.collaboratorName : "",
    payrollNumber: prefillData ? prefillData.payrollNumber.toString() : "",
    area: prefillData ? prefillData.area : "",
    weekId: nextWeekId,
  });

  const [answers, setAnswers] = useState<Record<number, any>>({});

  const tutorOptions = [
    { value: "", label: "Selecciona un tutor..." },
    ...catalogs.tutors.map((t) => ({
      value: t.id.toString(),
      label: t.name,
    })),
  ];

  const weekOptions = [
    { value: "", label: "Selecciona la semana..." },
    ...catalogs.weeks.map((w) => ({
      value: w.id.toString(),
      label: w.name,
    })),
  ];

  const lineOptions = [
    { value: "", label: "Selecciona el área/línea..." },
    ...catalogs.lines.map((l) => ({ value: l.name, label: l.name })),
  ];

  const handleAnswerChange = (
    question: Question,
    value: any,
    isCheckbox = false,
  ) => {
    setAnswers((prev) => {
      if (isCheckbox) {
        const currentSelected = prev[question.id] || [];
        const newSelected = currentSelected.includes(value)
          ? currentSelected.filter((item: number) => item !== value)
          : [...currentSelected, value];

        if (value === "Ninguno") {
          return { ...prev, [question.id]: [value] };
        }
        return {
          ...prev,
          [question.id]: newSelected.filter((v: any) => v !== "Ninguno"),
        };
      }
      return { ...prev, [question.id]: value };
    });
  };

  useEffect(() => {
    if (programId && sections.length > 0) {
      const loadData = async () => {
        const data = await getProgramById(programId);

        if (data) {
          setGeneralData({
            tutorId: data.tutorId.toString(),
            collaboratorName: data.collaboratorName,
            payrollNumber: data.payrollNumber.toString(),
            area: data.area,
            weekId: data.weekId.toString(),
          });

          const loadedAnswers: Record<number, any> = {};

          data.answers.forEach((ans) => {
            const question = sections
              .flatMap((s) => s.questions)
              .find((q) => q.id === ans.questionId);

            if (question?.questionTypeName === "Textarea") {
              loadedAnswers[ans.questionId] = ans.textValue;
            } else if (question?.questionTypeName === "Rating") {
              loadedAnswers[ans.questionId] = ans.ratingValue;
            } else if (question?.questionTypeName === "Checkbox") {
              if (!loadedAnswers[ans.questionId]) {
                loadedAnswers[ans.questionId] = [];
              }
              if (ans.optionId) {
                loadedAnswers[ans.questionId].push(ans.optionId);
              }
            } else {
              loadedAnswers[ans.questionId] = ans.optionId;
            }
          });

          setAnswers(loadedAnswers);
        }
      };

      loadData();
    }
  }, [programId, sections]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      tutorId: Number(generalData.tutorId),
      collaboratorName: generalData.collaboratorName,
      payrollNumber: Number(generalData.payrollNumber),
      area: generalData.area,
      weekId: Number(generalData.weekId),
      answers: Object.entries(answers).flatMap(([questionId, value]) => {
        if (Array.isArray(value)) {
          return value.map((optId) => ({
            questionId: Number(questionId),
            optionId: Number(optId),
            textValue: null,
            ratingValue: null,
          }));
        }

        return [
          {
            questionId: Number(questionId),
            optionId: typeof value === "number" ? value : null,
            textValue: typeof value === "string" ? value : null,
            ratingValue: typeof value === "number" && value <= 5 ? value : null,
          },
        ];
      }),
    };

    let isSuccess = false;
    if (programId) {
      isSuccess = await updateProgram(payload, programId);
    } else {
      isSuccess = await createProgram(payload);
    }

    if (isSuccess) {
      navigate("/programa-tutoreo");
    }
  };

  const renderInput = (question: Question) => {
    const value = answers[question.id];

    switch (question.questionTypeName) {
      case "Radio":
        return (
          <div className="flex flex-wrap gap-4 mt-3">
            {question.options.map((opt: Option) => (
              <label
                key={opt.optionId}
                className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 border 
                border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 
                transition-colors"
              >
                <input
                  type="radio"
                  name={`q_${question.id}`}
                  value={opt.optionId}
                  checked={value === opt.optionId}
                  onChange={() => handleAnswerChange(question, opt.optionId)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  required={question.isRequired}
                  disabled={isReadOnly || isSubmitting}
                />
                <span className="text-sm font-medium text-gray-700">
                  {opt.optionText}
                </span>
              </label>
            ))}
          </div>
        );

      case "Checkbox":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {question.options.map((opt: Option) => (
              <label
                key={opt.optionId}
                className="flex items-start gap-3 cursor-pointer p-3 bg-white border 
                border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 
                transition-all shadow-sm"
              >
                <input
                  type="checkbox"
                  value={opt.optionId}
                  checked={(value || []).includes(opt.optionId)}
                  onChange={() =>
                    handleAnswerChange(question, opt.optionId, true)
                  }
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  disabled={isReadOnly || isSubmitting}
                />
                <span className="text-sm font-medium text-gray-700 leading-tight">
                  {opt.optionText}
                </span>
              </label>
            ))}
          </div>
        );

      case "Textarea":
        return (
          <TextareaField
            label={question.questionText}
            value={value || ""}
            onChange={(e) => handleAnswerChange(question, e.target.value)}
            required={question.isRequired}
            className="mt-2"
            disabled={isReadOnly || isSubmitting}
          />
        );

      case "Rating":
        return (
          <div className="flex items-center gap-2 mt-3">
            {[...Array(question.maxRating || 5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  key={ratingValue}
                  type="button"
                  onClick={() => handleAnswerChange(question, ratingValue)}
                  className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                    value >= ratingValue
                      ? "text-yellow-400 drop-shadow-sm"
                      : "text-gray-300"
                  }`}
                  disabled={isReadOnly || isSubmitting}
                >
                  ★
                </button>
              );
            })}
            <span className="ml-3 text-sm text-gray-500 font-medium">
              {value
                ? `${value} de ${question.maxRating}`
                : "Selecciona una calificación"}
            </span>
          </div>
        );

      default:
        return (
          <p className="text-red-500 text-sm">Tipo de pregunta no soportado</p>
        );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            SECCIÓN 1. Datos generales
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Información de identificación del programa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <SelectField
            label="Nombre del tutor"
            options={tutorOptions}
            required
            value={generalData.tutorId}
            onChange={(e) =>
              setGeneralData({ ...generalData, tutorId: e.target.value })
            }
            disabled={isReadOnly || isSubmitting}
          />

          <SelectField
            label="Semana de seguimiento"
            options={weekOptions}
            required
            value={generalData.weekId}
            onChange={(e) =>
              setGeneralData({ ...generalData, weekId: e.target.value })
            }
            disabled={isReadOnly || isSubmitting}
          />

          <InputField
            label="Nombre del colaborador"
            type="text"
            required
            value={generalData.collaboratorName}
            onChange={(e) =>
              setGeneralData({
                ...generalData,
                collaboratorName: e.target.value,
              })
            }
            disabled={isReadOnly || isSubmitting}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Nómina"
              type="number"
              required
              value={generalData.payrollNumber}
              onChange={(e) =>
                setGeneralData({
                  ...generalData,
                  payrollNumber: e.target.value,
                })
              }
              disabled={isReadOnly || isSubmitting}
            />
            <SelectField
              label="Área / Línea"
              options={lineOptions}
              required
              value={generalData.area}
              onChange={(e) =>
                setGeneralData({ ...generalData, area: e.target.value })
              }
              disabled={isReadOnly || isSubmitting}
            />
          </div>
        </div>
      </div>

      {sections
        .filter((s) => s.questions.length > 0)
        .map((section) => (
          <div
            key={section.id}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200"
          >
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {section.sectionName}
              </h2>
            </div>

            <div className="space-y-6">
              {section.questions.map((question) => {
                if (question.parentQuestionId) {
                  const parentAnswer = answers[question.parentQuestionId];
                  if (parentAnswer !== question.showWhenOptionId) {
                    return null;
                  }
                }

                return (
                  <div key={question.id} className="bg-white p-1">
                    {question.questionTypeName !== "Textarea" && (
                      <label className="block text-[15px] font-semibold text-gray-800">
                        {question.questionText}
                        {question.isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    )}
                    {renderInput(question)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      <div
        className="sticky bottom-4 z-10 flex items-center justify-between bg-gray-900/95 
        backdrop-blur shadow-xl text-white p-4 rounded-2xl border border-gray-700"
      >
        <div className="items-center gap-2 text-sm text-gray-300 hidden sm:flex">
          <AlertCircle size={16} />
          <span>Asegúrate de contestar todos los campos obligatorios.</span>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-gray-300 
            hover:text-white hover:bg-gray-800 transition-colors hover:cursor-pointer"
          >
            Cancelar
          </button>
          {!isReadOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 
            hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-semibold 
              transition-colors shadow-md hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar Evaluación</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
