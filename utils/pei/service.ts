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

const OPCOES_LOREM = [
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor incididunt",
  "Ut labore et dolore magna aliqua",
];

const PERGUNTAS_PEI: { text: string; subQuestions: string[] }[] = [
  {
    text: "Quais conteúdos e habilidades do Currículo da Rede Estadual Paulista serão desenvolvidos no bimestre?",
    subQuestions: [
      "O que o estudante já consegue fazer?",
      "O que precisa e é possível de ser ajustado esse bimestre?",
      "E como isso será feito?",
    ],
  },
  {
    text: "Quais estratégias, intervenções pedagógicas e recursos de acessibilidade serão utilizados para favorecer o acesso, a participação e a aprendizagem do estudante?",
    subQuestions: [
      "Quais estratégias pedagógicas você utilizará para que o estudante consiga participar das aulas?",
      "Quais intervenções pedagógicas você utilizará para que o estudante consiga participar das aulas?",
      "Quais recursos de acessibilidade você utilizará para que o estudante consiga participar das aulas?",
    ],
  },
  {
    text: "Quais instrumentos serão utilizados para acompanhar o aprendizado do estudante de forma inclusiva e individualizada?",
    subQuestions: [
      "Como você vai avaliar o estudante respeitando seu ritmo, suas necessidades e suas formas de expressão?",
    ],
  },
];

function perguntasPei(): Question[] {
  const perguntas = PERGUNTAS_PEI.flatMap((grupo, grupoIndice) =>
    grupo.subQuestions.map((subpergunta, subIndice) => ({
      id: `q${grupoIndice + 1}s${subIndice + 1}`,
      text: subpergunta,
      parentText: grupo.text,
      parentOrder: grupoIndice + 1,
      selectionMode: "single" as const,
      options: OPCOES_LOREM.map((texto, o) => ({
        id: `q${grupoIndice + 1}s${subIndice + 1}o${o + 1}`,
        text: `${texto} ${letraDaOpcao(o)}`,
      })),
    })),
  );

  return perguntas.map((pergunta, indice) => ({
    ...pergunta,
    order: indice + 1,
    hasNext: indice < perguntas.length - 1,
  }));
}

function peiServiceDesenvolvimento(ctx: {
  aluno: Aluno;
  componente: string;
  periodo: string;
}): Promise<Question[]> {
  void ctx;
  return Promise.resolve(perguntasPei());
}

export const peiService: PeiService = {
  buscarPerguntas: peiServiceDesenvolvimento,
};
