"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Aluno } from "@/utils/data/types";
import {
  respostaVazia,
  type Answer,
  type Anexo,
  type PassoPEI,
  type Question,
  type StatusPEI,
} from "@/utils/pei/types";
import { peiService } from "@/utils/pei/service";

export const CHAVE_PEI = "metamorphia:pei:v3";

interface FluxoSalvo {
  alunoId: string;
  componente: string;
  periodo: string;
  passo: PassoPEI;
  currentIndex: number;
  questions: Question[];
  respostas: Record<string, Answer>;
}

export interface PeiFlowContext {
  aluno: Aluno | null;
  passo: PassoPEI;
  componente: string;
  periodo: string;
  status: StatusPEI;
  currentIndex: number;
  questions: Question[];
  respostas: Record<string, Answer>;
  mostrarRevisao: boolean;
  setMostrarRevisao: (valor: boolean) => void;
  setComponente: (valor: string) => void;
  setPeriodo: (valor: string) => void;
  irParaQuestoes: () => void;
  irParaForm: () => void;
  tentarNovamente: () => void;
  avancar: () => Promise<void>;
  voltar: () => void;
  selecionarOpcao: (opcaoId: string) => void;
  confirmarTexto: (texto: string) => void;
  adicionarAnexos: (files: File[]) => Promise<void>;
  removerAnexo: (nome: string) => void;
  respostaAtual: Answer;
  anexosAtuais: Anexo[];
  podeAvancar: boolean;
  fluxoEmAndamento: boolean;
  limpar: () => void;
}

const PeiFlowContexto = createContext<PeiFlowContext | null>(null);

function lerFluxoSalvo(aluno: Aluno | null): FluxoSalvo | null {
  if (!aluno || typeof window === "undefined") return null;
  try {
    const bruto = localStorage.getItem(`${CHAVE_PEI}:${aluno.id}`);
    if (!bruto) return null;
    const salvo = JSON.parse(bruto) as FluxoSalvo;
    if (salvo.alunoId !== aluno.id) return null;
    const questions = (salvo.questions ?? []).map((q) => ({
      ...q,
      selectionMode: "single" as const,
    }));
    const respostas: Record<string, Answer> = {};
    for (const [chave, resp] of Object.entries(salvo.respostas ?? {})) {
      respostas[chave] = {
        ...resp,
        selectedOptionIds: (resp.selectedOptionIds ?? []).slice(0, 1),
      };
    }
    return { ...salvo, questions, respostas };
  } catch {
    return null;
  }
}

function gravarFluxo(aluno: Aluno | null, fluxo: Omit<FluxoSalvo, "alunoId">) {
  if (!aluno || typeof window === "undefined") return;
  localStorage.setItem(
    `${CHAVE_PEI}:${aluno.id}`,
    JSON.stringify({ alunoId: aluno.id, ...fluxo, status: "pronto" }),
  );
}

export function PeiFlowProvider({
  aluno,
  children,
}: {
  aluno: Aluno | null;
  children: React.ReactNode;
}) {
  const salvoInicial = useMemo(() => lerFluxoSalvo(aluno), [aluno]);

  const [componente, setComponente] = useState(salvoInicial?.componente ?? "");
  const [periodo, setPeriodo] = useState(salvoInicial?.periodo ?? "");
  const [passo, setPasso] = useState<PassoPEI>(salvoInicial?.passo ?? "form");
  const [status, setStatus] = useState<StatusPEI>("pronto");
  const [currentIndex, setCurrentIndex] = useState(salvoInicial?.currentIndex ?? 0);
  const [questions, setQuestions] = useState<Question[]>(salvoInicial?.questions ?? []);
  const [respostas, setRespostas] = useState<Record<string, Answer>>(
    salvoInicial?.respostas ?? {},
  );
  const [mostrarRevisao, setMostrarRevisao] = useState(false);

  const carregarPerguntas = useCallback(async () => {
    if (!aluno || !componente || !periodo) return;
    setStatus("carregando");
    try {
      const resultado = await peiService.buscarPerguntas({ aluno, componente, periodo });
      setStatus("pronto");
      setQuestions(resultado);
    } catch {
      setStatus("erro");
    }
  }, [aluno, componente, periodo]);

  useEffect(() => {
    gravarFluxo(aluno, { componente, periodo, passo, currentIndex, questions, respostas });
  }, [aluno, componente, periodo, passo, currentIndex, questions, respostas]);

  const respostaAtual: Answer =
    respostas[questions[currentIndex]?.id] ?? respostaVazia(questions[currentIndex]?.id ?? "");

  const podeAvancar =
    status !== "carregando" &&
    (respostaAtual.selectedOptionIds.length > 0 || Boolean(respostaAtual.freeText?.trim()));

  const fluxoEmAndamento = componente !== "" || periodo !== "" || passo === "questoes";

  const irParaQuestoes = useCallback(async () => {
    if (!componente || !periodo) return;
    setPasso("questoes");
    await carregarPerguntas();
  }, [componente, periodo, carregarPerguntas]);

  const irParaForm = useCallback(() => {
    setPasso("form");
    setStatus("pronto");
  }, []);

  const tentarNovamente = useCallback(() => {
    carregarPerguntas();
  }, [carregarPerguntas]);

  const voltar = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((indice) => indice - 1);
    } else {
      irParaForm();
    }
  }, [currentIndex, irParaForm]);

  const avancar = useCallback(async () => {
    if (!podeAvancar || status === "salvando") return;
    const atual = questions[currentIndex];
    if (!atual?.hasNext) {
      setMostrarRevisao(true);
      return;
    }
    setStatus("salvando");
    await new Promise((resolver) => setTimeout(resolver, 350));
    setCurrentIndex((indice) => indice + 1);
    setStatus("pronto");
  }, [podeAvancar, status, questions, currentIndex]);

  const selecionarOpcao = useCallback(
    (opcaoId: string) => {
      const pergunta = questions[currentIndex];
      if (!pergunta || status === "salvando" || status === "carregando") return;

      setRespostas((prev) => {
        const resp = prev[pergunta.id] ?? respostaVazia(pergunta.id);
        return { ...prev, [pergunta.id]: { ...resp, selectedOptionIds: [opcaoId] } };
      });
    },
    [questions, currentIndex, status],
  );

  const confirmarTexto = useCallback(
    (texto: string) => {
      const pergunta = questions[currentIndex];
      if (!pergunta) return;
      setRespostas((prev) => {
        const atual = prev[pergunta.id] ?? respostaVazia(pergunta.id);
        return { ...prev, [pergunta.id]: { ...atual, freeText: texto } };
      });
    },
    [questions, currentIndex],
  );

  const adicionarAnexos = useCallback(
    async (files: File[]) => {
      const pergunta = questions[currentIndex];
      if (!pergunta || files.length === 0) return;
      const anexos = await Promise.all(
        files.map(
          (arquivo) =>
            new Promise<Anexo>((resolver) => {
              const leitor = new FileReader();
              leitor.onload = () =>
                resolver({
                  name: arquivo.name,
                  type: arquivo.type,
                  size: arquivo.size,
                  dataUrl: String(leitor.result),
                });
              leitor.readAsDataURL(arquivo);
            }),
        ),
      );
      setRespostas((prev) => {
        const atual = prev[pergunta.id] ?? respostaVazia(pergunta.id);
        return {
          ...prev,
          [pergunta.id]: { ...atual, attachments: [...(atual.attachments ?? []), ...anexos] },
        };
      });
    },
    [questions, currentIndex],
  );

  const removerAnexo = useCallback(
    (nome: string) => {
      const pergunta = questions[currentIndex];
      if (!pergunta) return;
      setRespostas((prev) => {
        const atual = prev[pergunta.id] ?? respostaVazia(pergunta.id);
        return {
          ...prev,
          [pergunta.id]: {
            ...atual,
            attachments: (atual.attachments ?? []).filter((anexo) => anexo.name !== nome),
          },
        };
      });
    },
    [questions, currentIndex],
  );

  const limpar = useCallback(() => {
    setComponente("");
    setPeriodo("");
    setPasso("form");
    setStatus("pronto");
    setCurrentIndex(0);
    setQuestions([]);
    setRespostas({});
    setMostrarRevisao(false);
    if (aluno && typeof window !== "undefined") {
      localStorage.removeItem(`${CHAVE_PEI}:${aluno.id}`);
    }
  }, [aluno]);

  const valor = useMemo<PeiFlowContext>(
    () => ({
      aluno,
      passo,
      componente,
      periodo,
      status,
      currentIndex,
      questions,
      respostas,
      mostrarRevisao,
      setMostrarRevisao,
      setComponente,
      setPeriodo,
      irParaQuestoes,
      irParaForm,
      tentarNovamente,
      avancar,
      voltar,
      selecionarOpcao,
      confirmarTexto,
      adicionarAnexos,
      removerAnexo,
      respostaAtual,
      anexosAtuais: respostaAtual.attachments ?? [],
      podeAvancar,
      fluxoEmAndamento,
      limpar,
    }),
    [
      aluno,
      passo,
      componente,
      periodo,
      status,
      currentIndex,
      questions,
      respostas,
      mostrarRevisao,
      irParaQuestoes,
      irParaForm,
      tentarNovamente,
      avancar,
      voltar,
      selecionarOpcao,
      confirmarTexto,
      adicionarAnexos,
      removerAnexo,
      respostaAtual,
      podeAvancar,
      fluxoEmAndamento,
      limpar,
    ],
  );

  return <PeiFlowContexto.Provider value={valor}>{children}</PeiFlowContexto.Provider>;
}

export function usePeiFlow(): PeiFlowContext {
  const contexto = useContext(PeiFlowContexto);
  if (!contexto) throw new Error("usePeiFlow precisa estar dentro de <PeiFlowProvider>");
  return contexto;
}
