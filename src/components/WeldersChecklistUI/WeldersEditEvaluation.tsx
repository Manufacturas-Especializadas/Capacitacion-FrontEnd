import { useNavigate, useParams } from "react-router-dom";
import { useWeldersChecklistMutations } from "../../hooks/useWeldersChecklistMutations";
import { type SyntheticEvent, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useCatalogs } from "../../hooks/useCatalogs";
import { useWeldersEditForm } from "../../hooks/useWeldersEditForm";
import { WelderDataSection } from "../../components/WeldersChecklistUI/WelderDataSection";
import { PracticalEvaluationSection } from "../../components/WeldersChecklistUI/PracticalEvaluationSection/PracticalEvaluationSection";
import { UnionEvaluationSection } from "../../components/WeldersChecklistUI/UnionEvaluationSection/UnionEvaluationSection";
import { SignaturesSection } from "../../components/WeldersChecklistUI/SignaturesSection/SignaturesSection";
import { SignatureModal } from "../../components/SignatureModal/SignatureModal";

export const WeldersEditEvaluation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateEvaluation, isSaving } = useWeldersChecklistMutations();
  const { lines, fetchLines } = useCatalogs();

  const {
    welderData,
    setWelderData,
    practicalSections,
    unionEvaluation,
    files,
    signatures,
    modalOpen,
    setModalOpen,
    currentSignerLabel,
    practicalScore,
    practicalCount,
    updatePracticalScore,
    updateQuestionText,
    addQuestion,
    removeQuestion,
    handleUpdateUnionScore,
    handleUpdateUnionAnswer,
    handleOpenSignatureModal,
    handleSaveSignature,
  } = useWeldersEditForm(id);

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const practicalGrade =
      practicalCount > 0 ? (practicalScore * 100) / (practicalCount * 4) : 0;

    let unionScore = 0;
    let unionCount = 0;
    unionEvaluation.forEach((u) => {
      if (
        u.score !== null &&
        !u.attribute.toLowerCase().includes("clasificaci")
      ) {
        unionScore += u.score;
        unionCount++;
      }
    });
    const unionGrade =
      unionCount > 0 ? (unionScore * 100) / (unionCount * 4) : 0;

    const totalPoints = practicalScore + unionScore;
    const totalQuestions = practicalCount + unionCount;
    const finalAverage = totalQuestions > 0 ? totalPoints / totalQuestions : 0;

    let masteryLevel = "No Apto";
    if (finalAverage >= 3.8) masteryLevel = "Experto";
    else if (finalAverage >= 3.2) masteryLevel = "Competente";
    else if (finalAverage >= 2.8) masteryLevel = "Básico";

    const payload = {
      employeeNumber: welderData.employeeNumber,
      evaluationDate: welderData.date,
      evaluatorName: welderData.evaluator,
      practicalGrade: Number(practicalGrade.toFixed(2)),
      unionGrade: Number(unionGrade.toFixed(2)),
      finalAverage: Number(finalAverage.toFixed(2)),
      totalPoints,
      masteryLevel,
      practicalAnswers: practicalSections.flatMap((sec) =>
        sec.questions
          .filter((q: any) => q.score !== null)
          .map((q: any) => ({
            sectionTitle: sec.title,
            questionText: q.text,
            score: q.score,
          })),
      ),
      unionAnswers: unionEvaluation
        .filter(
          (u) =>
            u.score !== null ||
            u.attribute.toLowerCase().includes("clasificaci"),
        )
        .map((u: any) => ({
          attributeName: u.attribute,
          answerText: u.answer || "",
          score: u.score || 0,
        })),
      signatureColaborador: signatures["colaborador"] || null,
      signatureCoordinadorArea: signatures["coordinadorArea"] || null,
      signatureCoordCapacitacion: signatures["coordCapacitacion"] || null,
      signatureSupervisor: signatures["supervisor"] || null,
      signatureEvaluador: signatures["evaluador"] || null,
      ...files,
    };

    const success = await updateEvaluation(Number(id), payload);
    if (success) navigate("/historial-checklist-soldadores");
  };

  if (!welderData) {
    return (
      <div className="p-8 text-center text-slate-500">
        Cargando evaluación...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen font-sans">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 mb-6 hover:text-slate-900 
        transition-colors hover:cursor-pointer"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-200">
          Corregir Evaluación #{id}
        </h2>

        <WelderDataSection
          data={welderData}
          productionLines={lines}
          onChange={(d) => setWelderData({ ...welderData, ...d })}
        />

        <PracticalEvaluationSection
          sections={practicalSections}
          onUpdateScore={updatePracticalScore}
          onUpdateQuestionText={updateQuestionText}
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
        />

        <UnionEvaluationSection
          items={unionEvaluation}
          previousSectionScore={practicalScore}
          previousSectionQuestionsCount={practicalCount}
          onUpdateAnswer={handleUpdateUnionAnswer}
          onUpdateScore={handleUpdateUnionScore}
        />

        <SignaturesSection
          signatures={signatures}
          onOpenModal={handleOpenSignatureModal}
        />

        <div className="flex justify-end mt-8 pb-12">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
              isSaving
                ? "bg-orange-400 text-white cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            }`}
          >
            {isSaving ? "Guardando Correcciones..." : "Guardar Correcciones"}
          </button>
        </div>
      </form>

      <SignatureModal
        isOpen={modalOpen}
        title={currentSignerLabel}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSignature}
      />
    </div>
  );
};
