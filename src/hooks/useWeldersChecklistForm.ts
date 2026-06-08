import { useState, type ChangeEvent } from "react";
import type { ExclusiveTestData } from "../components/WeldersChecklistUI/ExclusiveTestSection/ExclusiveTestSection";
import {
  INITIAL_PRACTICAL_SECTIONS,
  INITIAL_UNION_EVALUATION,
} from "../data/ChecklistQuestions";
import type {
  WelderData,
  PracticalSectionData,
  UnionEvaluationItem,
} from "../types/Types";

export const useWeldersChecklistForm = (
  employees: any[] = [],
  lines: any[] = [],
) => {
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

  const handleWelderDataChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setWelderData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "employeeNumber") {
        const match = employees.find((emp) => emp.employeeNumber === value);

        if (match) {
          newData.name = match.name;

          const empLineText = match.line?.toString().trim().toLowerCase();
          const empLineId = match.lineId?.toString();

          const lineObj = lines.find((l) => {
            const catalogId = l.id?.toString();
            const catalogName1 = l.lineName?.toString().trim().toLowerCase();
            const catalogName2 = l.name?.toString().trim().toLowerCase();

            return (
              (empLineId && catalogId === empLineId) ||
              (empLineText && catalogName1 === empLineText) ||
              (empLineText && catalogName2 === empLineText) ||
              (empLineText && catalogId === empLineText)
            );
          });

          if (lineObj) {
            newData.line = lineObj.id
              ? lineObj.id.toString()
              : lineObj.lineName || lineObj.name;
          } else if (match.lineId) {
            newData.line = match.lineId.toString();
          } else if (match.line) {
            newData.line = match.line;
          }
        }
      }

      return newData;
    });
  };

  const handleOpenSignatureModal = (id: string, label: string) => {
    setCurrentSignerId(id);
    setCurrentSignerLabel(label);
    setModalOpen(true);
  };
  const handleSaveSignature = (signatureDataUrl: string) => {
    setSignatures((prev) => ({ ...prev, [currentSignerId]: signatureDataUrl }));
    setModalOpen(false);
  };
  const handleExclusiveTestChange = (
    field: keyof ExclusiveTestData,
    value: string,
  ) => {
    setExclusiveTest((prev) => ({ ...prev, [field]: value }));
  };
  const updatePracticalScore = (
    sectionId: string,
    questionId: string,
    score: number,
  ) => {
    setPracticalSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q.id === questionId ? { ...q, score } : q,
              ),
            }
          : sec,
      ),
    );
  };
  const updateQuestionText = (
    sectionId: string,
    questionId: string,
    text: string,
  ) => {
    setPracticalSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: sec.questions.map((q) =>
                q.id === questionId ? { ...q, text } : q,
              ),
            }
          : sec,
      ),
    );
  };
  const addQuestion = (sectionId: string) => {
    setPracticalSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: [
                ...sec.questions,
                { id: `q_new_${Date.now()}`, text: "", score: null },
              ],
            }
          : sec,
      ),
    );
  };
  const removeQuestion = (sectionId: string, questionId: string) => {
    setPracticalSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: sec.questions.filter((q) => q.id !== questionId),
            }
          : sec,
      ),
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

  return {
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
  };
};
