import type { PracticalSectionData, UnionEvaluationItem } from "../types/Types";

export const INITIAL_PRACTICAL_SECTIONS: PracticalSectionData[] = [
  {
    id: "sec_1",
    title: "I. PREPARACIÓN DEL EQUIPO Y SEGURIDAD",
    questions: [
      {
        id: "q_1",
        text: "Utiliza equipo de protección personal adecuado.",
        score: null,
      },
      {
        id: "q_2",
        text: "Explica las medidas de seguridad en el uso de equipos en el proceso de brazing.",
        score: null,
      },
      {
        id: "q_3",
        text: "Conoce los diferentes tipos de gases usados en la soldadura.",
        score: null,
      },
      {
        id: "q_4",
        text: "Ajusta correctamente boquillas y accesorios.",
        score: null,
      },
      {
        id: "q_5",
        text: "Regulación adecuada de los gases a utilizar (Flama neutra).",
        score: null,
      },
      {
        id: "q_6",
        text: "Enciende y apaga correctamente el soplete.",
        score: null,
      },
      { id: "q_7", text: "Controla la llama.", score: null },
    ],
  },
  {
    id: "sec_2",
    title: "II. PREPARACIÓN Y EJECUCIÓN DE LA SOLDADURA",
    questions: [
      {
        id: "q_8",
        text: "Revisa y elige correctamente los componentes a utilizar en el ensamble.",
        score: null,
      },
      {
        id: "q_9",
        text: "Solape-inserción según aplique en el ensamble.",
        score: null,
      },
      { id: "q_10", text: "Aplicación de nitrógeno.", score: null },
      {
        id: "q_11",
        text: "Mantiene distancia y velocidad constante de la soldadura.",
        score: null,
      },
      {
        id: "q_12",
        text: "Realiza el filete uniforme de la soldadura.",
        score: null,
      },
    ],
  },
  {
    id: "sec_3",
    title: "III. CONTROL DE CALIDAD",
    questions: [
      { id: "q_13", text: "Inspección visual de la soldadura.", score: null },
      { id: "q_14", text: "Identifica y corrige defectos.", score: null },
    ],
  },
];

export const INITIAL_UNION_EVALUATION: UnionEvaluationItem[] = [
  { id: "u_1", attribute: "Clasificación:", answer: "", score: null },
  { id: "u_2", attribute: "Descripción:", answer: "", score: null },
  { id: "u_3", attribute: "Material:", answer: "", score: null },
  { id: "u_4", attribute: "Diámetro de tubería:", answer: "", score: null },
  { id: "u_5", attribute: "Tipo de soldadura:", answer: "", score: null },
  { id: "u_6", attribute: "Posición de flujo:", answer: "", score: null },
];
