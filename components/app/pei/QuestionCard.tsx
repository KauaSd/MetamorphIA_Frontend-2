"use client";

import type { ReactNode } from "react";
import Icon from "@/public/icon.png";
import Button from "@/components/common/Button";
import OptionPill from "@/components/app/pei/OptionPill";
import StepNavigator from "@/components/app/pei/StepNavigator";
import { letraDaOpcao } from "@/utils/pei/types";
import type { Answer, Question, StatusPEI } from "@/utils/pei/types";

export interface QuestionCardProps {
  question: Question;
  resposta: Answer;
  status: StatusPEI;
  onSelecionarOpcao: (opcaoId: string) => void;
  onVoltar: () => void;
  onAvancar: () => void;
  onTentarNovamente: () => void;
  footer?: ReactNode;
}

export default function QuestionCard(props: QuestionCardProps) {
  const {
    question,
    resposta,
    status,
    onSelecionarOpcao,
    onVoltar,
    onAvancar,
    onTentarNovamente,
    footer,
  } = props;

  const selecionadas = resposta.selectedOptionIds;
  const CARREGANDO = status === "carregando" || status === "salvando";

  return (
    <div className="flex w-full flex-col gap-3.5 rounded-[36px] bg-surface-base px-6 py-5 animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-[48px] sm:px-9 sm:py-6">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-inverse p-2 sm:h-13 sm:w-13">
            <img src={Icon.src} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-primary sm:text-lg">
              {question.parentText
                ? `Parte ${question.parentOrder}: ${question.parentText}`
                : question.text}
            </p>
            {question.parentText && (
              <p className="mt-1.5 text-sm text-primary sm:text-[15px]">{question.text}</p>
            )}
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
        <div data-testid="skeleton" aria-busy="true" className="flex flex-col gap-2.5 py-1">
          <div className="h-10 w-full animate-pulse rounded-full rounded-br-none bg-sunken" />
          <div className="h-10 w-full animate-pulse rounded-full rounded-br-none bg-sunken" />
          <div className="h-10 w-full animate-pulse rounded-full rounded-br-none bg-sunken" />
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

      {footer ? <div className="pt-1">{footer}</div> : null}
    </div>
  );
}