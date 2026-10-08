"use client";

import Icon from "@/public/icon.png";
import Button from "@/components/common/Button";
import OptionPill from "@/components/app/pei/OptionPill";
import StepNavigator from "@/components/app/pei/StepNavigator";
import { letraDaOpcao } from "@/utils/pei/types";
import { componenteLabel } from "@/utils/pei/opcoes";
import type { Answer, Question, StatusPEI } from "@/utils/pei/types";

export interface QuestionCardProps {
  alunoNome: string;
  componente: string;
  question: Question;
  index: number;
  resposta: Answer;
  status: StatusPEI;
  onSelecionarOpcao: (opcaoId: string) => void;
  onVoltar: () => void;
  onAvancar: () => void;
  onTentarNovamente: () => void;
}

export default function QuestionCard(props: QuestionCardProps) {
  const {
    alunoNome,
    componente,
    question,
    index,
    resposta,
    status,
    onSelecionarOpcao,
    onVoltar,
    onAvancar,
    onTentarNovamente,
  } = props;

  const selecionadas = resposta.selectedOptionIds;
  const CARREGANDO = status === "carregando" || status === "salvando";

  return (
    <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-3 rounded-[70px] bg-surface-muted/50 px-4 py-3 animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:py-4">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-14 w-14 p-2 shrink-0 overflow-hidden rounded-full bg-surface-inverse">
            <img src={Icon.src} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-primary">
              {alunoNome} - PEI - {componenteLabel(componente)}
            </p>
            <p className="text-sm text-primary sm:text-base">
              {index + 1}. {question.text}
            </p>
          </div>
        </div>
        <StepNavigator
          podeAvancar={selecionadas.length > 0 || Boolean(resposta.freeText?.trim())}
          salvando={status === "salvando"}
          carregando={status === "carregando"}
          onAnterior={onVoltar}
          onProximo={onAvancar}
          avancarLabel="Próxima pergunta"
        />
      </div>

      {status === "erro" ? (
        <div className="flex flex-col items-center gap-3 py-4" data-testid="erro">
          <p className="text-center text-sm text-secondary sm:text-base">
            Não foi possível carregar essa pergunta.
          </p>
          <Button onClick={onTentarNovamente} className="w-auto px-6">
            Tentar novamente
          </Button>
        </div>
      ) : CARREGANDO ? (
        <div data-testid="skeleton" aria-busy="true" className="flex flex-col gap-2 py-1">
          <div className="h-10 w-full animate-pulse rounded-full bg-sunken" />
          <div className="h-10 w-full animate-pulse rounded-full bg-sunken" />
          <div className="h-10 w-full animate-pulse rounded-full bg-sunken" />
        </div>
      ) : (
        <>
          {question.options.length > 0 && (
            <div className="flex flex-col gap-2">
              {question.options.map((opcao, indice) => (
                <OptionPill
                  key={opcao.id}
                  letra={letraDaOpcao(indice)}
                  texto={opcao.text}
                  selecionado={selecionadas.includes(opcao.id)}
                  modo={question.selectionMode === "single" ? "single" : "multiple"}
                  onAlternar={() => onSelecionarOpcao(opcao.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}