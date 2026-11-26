"use client";

import {
  createContext,
  useCallback,
  useContext,
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
import { updateAluno } from "@/utils/data/controller";
import { apiDbFetch, getAuthToken, parseNumeroId } from "@/utils/apiClient";

export const CHAVE_PEI = "metamorphia:pei:v3";

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
  enviarConhecimentoAluno: (texto: string) => Promise<void>;
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

export function PeiFlowProvider({
  aluno,
  children,
}: {
  aluno: Aluno | null;
  children: React.ReactNode;
}) {
  const [componente, setComponente] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [passo, setPasso] = useState<PassoPEI>("form");
  const [status, setStatus] = useState<StatusPEI>("pronto");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [respostas, setRespostas] = useState<Record<string, Answer>>({});
  const [mostrarRevisao, setMostrarRevisao] = useState(false);
  const [conhecimentoRespondido, setConhecimentoRespondido] = useState(false);
  const [descricaoConhecimento, setDescricaoConhecimento] = useState("");

  const carregarPerguntas = useCallback(
    async (descricaoOverride?: string) => {
      if (!aluno || !componente || !periodo) return;
      setStatus("carregando");
      try {
        const descricaoAluno =
          descricaoOverride?.trim() ||
          descricaoConhecimento.trim() ||
          aluno.descricao?.trim() ||
          undefined;
        const resultado = await peiService.buscarPerguntas({
          aluno,
          componente,
          periodo,
          descricaoAluno,
        });
        setStatus("pronto");
        setQuestions(resultado);
      } catch {
        setStatus("erro");
      }
    },
    [aluno, componente, periodo, descricaoConhecimento],
  );

  const respostaAtual: Answer =
    respostas[questions[currentIndex]?.id] ?? respostaVazia(questions[currentIndex]?.id ?? "");

  const podeAvancar =
    status !== "carregando" &&
    (respostaAtual.selectedOptionIds.length > 0 || Boolean(respostaAtual.freeText?.trim()));

  const fluxoEmAndamento =
    componente !== "" || periodo !== "" || passo === "conhecer" || passo === "questoes";

  const irParaQuestoes = useCallback(async () => {
    if (!componente || !periodo) return;
    const descAtual = aluno?.descricao?.trim() ?? "";
    const ehDescricaoPadrao = /^Estudante .+?, idade .+?, perfil .+\.?$/i.test(descAtual);
    const precisaConhecer = Boolean(
      aluno && (!descAtual || ehDescricaoPadrao) && !conhecimentoRespondido,
    );
    if (precisaConhecer) {
      setPasso("conhecer");
      return;
    }
    setPasso("questoes");
    await carregarPerguntas();
  }, [componente, periodo, aluno, conhecimentoRespondido, carregarPerguntas]);

  const enviarConhecimentoAluno = useCallback(
    async (texto: string) => {
      const limpo = texto.trim();
      if (!limpo || !aluno || status === "salvando") return;
      setStatus("salvando");
      try {
        const numId = parseNumeroId(aluno.id);
        if (numId !== null && getAuthToken()) {
          await apiDbFetch(`/Alunos/${numId}/descricao`, {
            method: "PATCH",
            body: JSON.stringify({ desc_aluno: limpo }),
          }).catch(() => {});
        }
        await updateAluno(aluno.id, { descricao: limpo }).catch(() => {});
        setDescricaoConhecimento(limpo);
        setConhecimentoRespondido(true);
        setPasso("questoes");
        await carregarPerguntas(limpo);
      } catch {
        setStatus("pronto");
      }
    },
    [aluno, status, carregarPerguntas],
  );

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
    setConhecimentoRespondido(false);
    setDescricaoConhecimento("");
  }, []);

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
      enviarConhecimentoAluno,
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
      enviarConhecimentoAluno,
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
