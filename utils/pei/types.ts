import type { Aluno } from "@/utils/data/types";

export type Question = {
  id: string;
  order: number;
  text: string;
  selectionMode: "single" | "multiple";
  options: { id: string; text: string }[];
  hasNext: boolean;
};

export type Anexo = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

export type Answer = {
  questionId: string;
  selectedOptionIds: string[];
  freeText?: string;
  attachments?: Anexo[];
};

export type StatusPEI = "pronto" | "carregando" | "salvando" | "erro";

export type PassoPEI = "form" | "questoes";

export function respostaVazia(questionId: string): Answer {
  return { questionId, selectedOptionIds: [] };
}

export function letraDaOpcao(indice: number): string {
  return String.fromCharCode(65 + indice);
}

export type { Aluno };