import { ArrowLeft } from "lucide-react";
import { useWeldersChecklistForm } from "../../hooks/useWeldersChecklistForm";
import { WelderDataSection } from "../../components/WeldersChecklistUI/WelderDataSection";
import { PracticalEvaluationSection } from "../../components/WeldersChecklistUI/PracticalEvaluationSection/PracticalEvaluationSection";
import { UnionEvaluationSection } from "../../components/WeldersChecklistUI/UnionEvaluationSection/UnionEvaluationSection";
import { ExclusiveTestSection } from "../../components/WeldersChecklistUI/ExclusiveTestSection/ExclusiveTestSection";
import { EvidenceSection } from "../../components/WeldersChecklistUI/EvidenceSection/EvidenceSection";
import { SignaturesSection } from "../../components/WeldersChecklistUI/SignaturesSection/SignaturesSection";
import { SignatureModal } from "../../components/SignatureModal/SignatureModal";

export const WeldersChecklistForm = () => {
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
  } = useWeldersChecklistForm();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            className="p-2 bg-white text-slate-500 hover:text-orange-600 
            hover:bg-orange-50 rounded-full transition-colors shadow-sm cursor-pointer"
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

        <form className="space-y-6">
          <WelderDataSection
            data={welderData}
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
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white 
              font-bold rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Guardar
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
