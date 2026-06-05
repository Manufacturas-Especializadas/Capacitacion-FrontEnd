import { ArrowLeft } from "lucide-react";
import { WelderDataSection } from "../../components/WeldersChecklistUI/WelderDataSection";
import { useState, type ChangeEvent } from "react";
import type {
  PracticalSectionData,
  UnionEvaluationItem,
  WelderData,
} from "../../types/Types";
// import { useNavigate } from "react-router-dom";
import {
  INITIAL_PRACTICAL_SECTIONS,
  INITIAL_UNION_EVALUATION,
} from "../../data/ChecklistQuestions";
import { PracticalEvaluationSection } from "../../components/WeldersChecklistUI/PracticalEvaluationSection/PracticalEvaluationSection";
import { UnionEvaluationSection } from "../../components/WeldersChecklistUI/UnionEvaluationSection/UnionEvaluationSection";
import {
  ExclusiveTestSection,
  type ExclusiveTestData,
} from "../../components/WeldersChecklistUI/ExclusiveTestSection/ExclusiveTestSection";
import { SignaturesSection } from "../../components/WeldersChecklistUI/SignaturesSection/SignaturesSection";
import { SignatureModal } from "../../components/SignatureModal/SignatureModal";
import { EvidenceSection } from "../../components/WeldersChecklistUI/EvidenceSection/EvidenceSection";

export const WeldersChecklistForm = () => {
  // const navigate = useNavigate();

  const [welderData, setWelderData] = useState<WelderData>({
    name: "",
    employeeNumber: "",
    date: new Date().toISOString().split("T")[0],
    line: "",
    evaluator: "",
  });

  const [practicalSections, setPracticalSections] = useState<
    PracticalSectionData[]
  >(INITIAL_PRACTICAL_SECTIONS);

  const [unionEvaluation, setUnionEvaluation] = useState<UnionEvaluationItem[]>(
    INITIAL_UNION_EVALUATION,
  );

  const [exclusiveTest, setExclusiveTest] = useState<ExclusiveTestData>({
    reference: "Sin requerimiento",
    result: "",
  });

  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSignerId, setCurrentSignerId] = useState("");
  const [currentSignerLabel, setCurrentSignerLabel] = useState("");

  const handleOpenSignatureModal = (id: string, label: string) => {
    setCurrentSignerId(id);
    setCurrentSignerLabel(label);
    setModalOpen(true);
  };

  const handleSaveSignature = (signatureDataUrl: string) => {
    setSignatures((prev) => ({
      ...prev,
      [currentSignerId]: signatureDataUrl,
    }));
    setModalOpen(false);
  };

  const handleWelderDataChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setWelderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updatePracticalScore = (
    sectionId: string,
    questionId: string,
    score: number,
  ) => {
    setPracticalSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) =>
              q.id === questionId ? { ...q, score } : q,
            ),
          };
        }
        return sec;
      }),
    );
  };

  const updateQuestionText = (
    sectionId: string,
    questionId: string,
    text: string,
  ) => {
    setPracticalSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.map((q) =>
              q.id === questionId ? { ...q, text } : q,
            ),
          };
        }
        return sec;
      }),
    );
  };

  const addQuestion = (sectionId: string) => {
    setPracticalSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: [
              ...sec.questions,
              { id: `q_new_${Date.now()}`, text: "", score: null },
            ],
          };
        }
        return sec;
      }),
    );
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setPracticalSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            questions: sec.questions.filter((q) => q.id !== questionId),
          };
        }
        return sec;
      }),
    );
  };

  const handleUpdateUnionAnswer = (id: string, answer: string) => {
    setUnionEvaluation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, answer } : item)),
    );
  };

  const handleUpdateUnionScore = (id: string, score: number | null) => {
    setUnionEvaluation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score } : item)),
    );
  };

  const handleExclusiveTestChange = (
    field: keyof ExclusiveTestData,
    value: string,
  ) => {
    setExclusiveTest((prev) => ({ ...prev, [field]: value }));
  };

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
