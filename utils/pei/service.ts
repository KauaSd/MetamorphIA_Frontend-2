import type { Question } from "@/utils/pei/types";
import { letraDaOpcao } from "@/utils/pei/types";
import type { Aluno } from "@/utils/data/types";

export interface PeiService {
  buscarPerguntas(ctx: {
    aluno: Aluno;
    componente: string;
    periodo: string;
  }): Promise<Question[]>;
}

const TEXTO_LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.";

const OPCOES_LOREM = [
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor incididunt",
  "Ut labore et dolore magna aliqua",
];

function perguntasLorem(): Question[] {
  return Array.from({ length: 10 }, (_, indice) => ({
    id: `q${indice + 1}`,
    order: indice + 1,
    text: TEXTO_LOREM,
    selectionMode: indice % 2 === 0 ? "multiple" : "single",
    options: OPCOES_LOREM.map((texto, o) => ({
      id: `q${indice + 1}o${o + 1}`,
      text: `${texto} ${letraDaOpcao(o)}`,
    })),
    hasNext: indice < 9,
  }));
}

function peiServiceDesenvolvimento(ctx: {
  aluno: Aluno;
  componente: string;
  periodo: string;
}): Promise<Question[]> {
  void ctx;
  return Promise.resolve(perguntasLorem());
}

export const peiService: PeiService = {
  buscarPerguntas: peiServiceDesenvolvimento,
};