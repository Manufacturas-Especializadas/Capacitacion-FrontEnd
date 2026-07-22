import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  Hash,
  Calendar,
  CheckCircle,
  FileText,
  Star,
  Clock,
} from "lucide-react";
import { useCatalogs } from "../../../hooks/useCatalogs";
import { useTutoringPrograms } from "../../../hooks/useTutoringPrograms";
import type { Question } from "../../../types/Types";

export const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProgramById,
    data: sections,
    isFetchingProgram,
  } = useTutoringPrograms();
  const { tutors, fetchAll, isLoadingCatalogs } = useCatalogs();

  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    const loadDetails = async () => {
      await fetchAll();

      if (id) {
        const data = await getProgramById(Number(id));
        setProgram(data);
      }
    };
    loadDetails();
  }, [id]);

  const renderAnswer = (question: Question) => {
    if (!program || !program.answers) return null;

    const qAnswers = program.answers.filter(
      (a: any) => a.questionId === question.id,
    );

    if (qAnswers.length === 0) {
      return (
        <span className="text-gray-400 italic text-sm">Sin respuesta</span>
      );
    }

    if (question.questionTypeName === "Textarea") {
      return (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3.5 mt-2">
          <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
            {qAnswers[0].textValue || "Sin comentarios"}
          </p>
        </div>
      );
    }

    if (question.questionTypeName === "Rating") {
      return (
        <div className="flex items-center gap-1.5 mt-2">
          {[...Array(question.maxRating || 5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < (qAnswers[0].ratingValue || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200"
              }
            />
          ))}
          <span className="ml-2 font-semibold text-gray-700 text-sm">
            {qAnswers[0].ratingValue} / {question.maxRating}
          </span>
        </div>
      );
    }

    const optionTexts = qAnswers
      .map((ans: any) => {
        const optionDef = question.options.find(
          (o) => o.optionId === ans.optionId,
        );
        return optionDef ? optionDef.optionText : "";
      })
      .filter(Boolean);

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {optionTexts.map((text: string, i: number) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 
            border border-blue-100 text-blue-700 text-sm font-medium"
          >
            <CheckCircle size={14} className="text-blue-500" />
            {text}
          </span>
        ))}
      </div>
    );
  };

  if (isFetchingProgram || isLoadingCatalogs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div
          className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full 
          animate-spin"
        ></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Generando reporte del programa...
        </p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center">
        <p className="text-red-500 font-medium">
          No se encontró la información del programa.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline hover:cursor-pointer"
        >
          Volver
        </button>
      </div>
    );
  }

  const tutorName =
    tutors.find((t) => t.id === program.tutorId)?.name || "Tutor no encontrado";

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 
            hover:text-gray-800 hover:bg-gray-50 transition-colors shadow-sm hover:cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detalles de Evaluación
            </h1>
            <p className="text-gray-500 text-sm">
              Resumen completo del formulario de tutoreo
            </p>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border 
          border-gray-200 shadow-sm"
        >
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Semana {program.weekId}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky 
            top-6"
          >
            <div
              className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center 
              justify-center mb-4 border border-blue-100"
            >
              <User size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {program.collaboratorName}
            </h2>
            <p className="text-blue-600 text-sm font-semibold mb-6 flex items-center gap-1.5">
              <Briefcase size={16} /> Colaborador
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Hash size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Nómina
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {program.payrollNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Área / Línea
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {program.area}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Tutor Asignado
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {tutorName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Fecha de Evaluación
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(program.createdDate).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {sections
            .filter((s) => s.questions.length > 0)
            .map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <FileText className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">
                    {section.sectionName}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {section.questions.map((question) => {
                    if (question.parentQuestionId) {
                      const parentAnswer = program.answers.find(
                        (a: any) => a.questionId === question.parentQuestionId,
                      );
                      if (
                        !parentAnswer ||
                        parentAnswer.optionId !== question.showWhenOptionId
                      ) {
                        return null;
                      }
                    }

                    const isFullWidth =
                      question.questionTypeName === "Textarea";

                    return (
                      <div
                        key={question.id}
                        className={`${isFullWidth ? "md:col-span-2" : "col-span-1"}`}
                      >
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {question.questionText}
                        </p>
                        {renderAnswer(question)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
