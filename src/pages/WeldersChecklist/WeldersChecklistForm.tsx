import { ArrowLeft } from "lucide-react";
import { useWeldersChecklistForm } from "../../hooks/useWeldersChecklistForm";
import { WelderDataSection } from "../../components/WeldersChecklistUI/WelderDataSection";
import { PracticalEvaluationSection } from "../../components/WeldersChecklistUI/PracticalEvaluationSection/PracticalEvaluationSection";
import { UnionEvaluationSection } from "../../components/WeldersChecklistUI/UnionEvaluationSection/UnionEvaluationSection";
import { ExclusiveTestSection } from "../../components/WeldersChecklistUI/ExclusiveTestSection/ExclusiveTestSection";
import { EvidenceSection } from "../../components/WeldersChecklistUI/EvidenceSection/EvidenceSection";
import { SignaturesSection } from "../../components/WeldersChecklistUI/SignaturesSection/SignaturesSection";
import { SignatureModal } from "../../components/SignatureModal/SignatureModal";
import { useWeldersChecklistMutations } from "../../hooks/useWeldersChecklistMutations";
import { useEffect, type SyntheticEvent } from "react";
import type { WelderEvaluations } from "../../types/Types";
import { useNavigate } from "react-router-dom";
import { useCatalogs } from "../../hooks/useCatalogs";
import { useEmployees } from "../../hooks/useEmployees";

export const WeldersChecklistForm = () => {
  const navigate = useNavigate();

  const { lines, fetchLines } = useCatalogs();
  const { employees, createNewEmployee, isLoadingEmployees } = useEmployees();

  useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  const {
    welderData,
    practicalSections,
    unionEvaluation,
    exclusiveTest,
    evidencePhoto,
    signatures,
    modalOpen,
    currentSignerLabel,
    setEvidencePhoto,
    setModalOpen,
    handleWelderDataChange,
    updatePracticalScore,
    updateQuestionText,
    addQuestion,
    removeQuestion,
    handleUpdateUnionAnswer,
    handleUpdateUnionScore,
    handleExclusiveTestChange,
    handleOpenSignatureModal,
    handleSaveSignature,
  } = useWeldersChecklistForm(employees, lines);

  const { saveEvaluation, isSaving } = useWeldersChecklistMutations();
  let practicalScore = 0;
  let practicalCount = 0;

  practicalSections.forEach((sec) =>
    sec.questions.forEach((q) => {
      if (q.score !== null) {
        practicalScore += q.score;
        practicalCount++;
      }
    }),
  );

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingEmployee = employees.find(
      (emp) => emp.employeeNumber === welderData.employeeNumber,
    );

    if (!existingEmployee) {
      const newEmp = await createNewEmployee({
        employeeNumber: welderData.employeeNumber,
        name: welderData.name,
        productionLineId: Number(welderData.line),
      });

      if (!newEmp) return;
    }

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

    const payload: WelderEvaluations = {
      employeeNumber: welderData.employeeNumber,
      evaluationDate: welderData.date,
      evaluatorName: welderData.evaluator,
      exclusiveTestReference: exclusiveTest.reference,
      totalPoints: totalPoints,
      practicalGrade: Number(practicalGrade.toFixed(2)),
      unionGrade: Number(unionGrade.toFixed(2)),
      finalAverage: Number(finalAverage.toFixed(2)),
      masteryLevel,
      practicalAnswers: practicalSections.flatMap((sec) =>
        sec.questions
          .filter((q) => q.score !== null)
          .map((q) => ({
            sectionTitle: sec.title,
            questionText: q.text,
            score: q.score!,
          })),
      ),
      unionAnswers: unionEvaluation
        .filter((u) => u.score !== null)
        .map((u) => ({
          attributeName: u.attribute,
          answerText: u.answer || "",
          score: u.score!,
        })),
      evidencePhoto: evidencePhoto || null,
      signatureColaborador: signatures["colaborador"] || null,
      signatureCoordinadorArea: signatures["coordinadorArea"] || null,
      signatureCoordCapacitacion: signatures["coordCapacitacion"] || null,
      signatureSupervisor: signatures["supervisor"] || null,
      signatureEvaluador: signatures["evaluador"] || null,
    };

    const success = await saveEvaluation(payload);

    if (success) {
      navigate("/historial-checklist-soldadores");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate("/historial-checklist-soldadores")}
            className="p-2 bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Evaluación de Soldadura
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Checklist de habilidades operativas y teóricas
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <WelderDataSection
            data={welderData}
            productionLines={lines}
            onChange={handleWelderDataChange}
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
          <ExclusiveTestSection
            data={exclusiveTest}
            onChange={handleExclusiveTestChange}
          />
          <EvidenceSection photo={evidencePhoto} onChange={setEvidencePhoto} />
          <SignaturesSection
            signatures={signatures}
            onOpenModal={handleOpenSignatureModal}
          />

          <div className="flex justify-end mt-8 pb-12">
            <button
              type="submit"
              disabled={isSaving || isLoadingEmployees}
              className={`px-8 py-4 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                isSaving || isLoadingEmployees
                  ? "bg-orange-400 text-white cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
              }`}
            >
              {isSaving
                ? "Guardando y Subiendo Archivos..."
                : "Guardar Evaluación"}
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
    </div>
  );
};
