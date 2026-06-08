import { useState, useEffect } from "react";
import { weldersChecklistService } from "../api/services/WeldersChecklistService";

export const useWeldersEditForm = (evaluationId: string | undefined) => {
  const [welderData, setWelderData] = useState<any>(null);
  const [practicalSections, setPracticalSections] = useState<any[]>([]);
  const [unionEvaluation, setUnionEvaluation] = useState<any[]>([]);

  const [files, setFiles] = useState<any>({});
  const [existingUrls, setExistingUrls] = useState<any>({});

  const [signatures, setSignatures] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSignerLabel, setCurrentSignerLabel] = useState("");
  const [currentSignerKey, setCurrentSignerKey] = useState("");

  useEffect(() => {
    if (evaluationId) {
      loadData(Number(evaluationId));
    }
  }, [evaluationId]);

  const loadData = async (evalId: number) => {
    const data = await weldersChecklistService.getById(evalId);

    setWelderData({
      employeeNumber: data.employeeNumber,
      name: data.employeeName,
      date: data.evaluationDate.split("T")[0],
      evaluator: data.evaluatorName,
      line: data.lineId,
    });

    setExistingUrls({
      evidencePhotoUrl: data.evidencePhotoUrl,
      signatureColaboradorUrl: data.signatureColaboradorUrl,
      signatureCoordinadorAreaUrl: data.signatureCoordinadorAreaUrl,
      signatureCoordCapacitacionUrl: data.signatureCoordCapacitacionUrl,
      signatureSupervisorUrl: data.signatureSupervisorUrl,
      signatureEvaluadorUrl: data.signatureEvaluadorUrl,
    });

    setSignatures({
      colaborador: data.signatureColaboradorUrl || "",
      coordinadorArea: data.signatureCoordinadorAreaUrl || "",
      coordCapacitacion: data.signatureCoordCapacitacionUrl || "",
      supervisor: data.signatureSupervisorUrl || "",
      evaluador: data.signatureEvaluadorUrl || "",
    });

    const groupedPractical = data.practicalAnswers.reduce(
      (acc: any[], curr: any) => {
        let section = acc.find((s: any) => s.title === curr.sectionTitle);
        if (!section) {
          section = {
            id: crypto.randomUUID(),
            title: curr.sectionTitle,
            questions: [],
          };
          acc.push(section);
        }
        section.questions.push({
          id: crypto.randomUUID(),
          text: curr.questionText,
          score: curr.score,
        });
        return acc;
      },
      [],
    );
    setPracticalSections(groupedPractical.length > 0 ? groupedPractical : []);

    const mappedUnion = data.unionAnswers.map((u: any) => ({
      id: crypto.randomUUID(),
      attribute: u.attributeName,
      answer: u.answerText,
      score: u.score,
    }));
    setUnionEvaluation(mappedUnion.length > 0 ? mappedUnion : []);
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
              questions: sec.questions.map((q: any) =>
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
              questions: sec.questions.map((q: any) =>
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
                { id: crypto.randomUUID(), text: "", score: null },
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
              questions: sec.questions.filter((q: any) => q.id !== questionId),
            }
          : sec,
      ),
    );
  };

  // --- Handlers de Unión ---
  const handleUpdateUnionScore = (id: string, score: number | null) => {
    setUnionEvaluation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score } : item)),
    );
  };

  const handleUpdateUnionAnswer = (id: string, answer: string) => {
    setUnionEvaluation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, answer } : item)),
    );
  };

  // --- Handlers de Firmas ---
  const handleOpenSignatureModal = (key: string, label: string) => {
    setCurrentSignerKey(key);
    setCurrentSignerLabel(label);
    setModalOpen(true);
  };

  const handleSaveSignature = (signatureDataUrl: string) => {
    setSignatures((prev) => ({
      ...prev,
      [currentSignerKey]: signatureDataUrl,
    }));
  };

  // --- Cálculos en vivo ---
  let practicalScore = 0;
  let practicalCount = 0;
  practicalSections.forEach((sec) =>
    sec.questions.forEach((q: any) => {
      if (q.score !== null) {
        practicalScore += q.score;
        practicalCount++;
      }
    }),
  );

  return {
    welderData,
    setWelderData,
    practicalSections,
    unionEvaluation,
    files,
    setFiles,
    existingUrls,
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
  };
};
