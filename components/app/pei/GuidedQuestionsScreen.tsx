"use client";

import type { ReactNode } from "react";
import { usePeiFlow } from "@/components/app/state/PeiFlowProvider";
import InfoNotice from "@/components/app/pei/InfoNotice";
import QuestionCard from "@/components/app/pei/QuestionCard";
import { BarraCarregando } from "@/components/common/Carregando";

export default function GuidedQuestionsScreen({ chatInput }: { chatInput?: ReactNode }) {
  const fluxo = usePeiFlow();

  const {
    aluno,
    componente,
    status,
    currentIndex,
    questions,
    respostaAtual,
    selecionarOpcao,
    voltar,
    avancar,
    tentarNovamente,
  } = fluxo;

  const pergunta = questions[currentIndex];
  if (!aluno) return null;

  if (!pergunta) {
    if (status === "carregando") {
      return (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Carregando perguntas do PEI"
          className="flex items-center justify-center py-10"
        >
          <BarraCarregando className="w-52" />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[66rem] flex-col gap-4">
      <InfoNotice componente={componente} />
      <QuestionCard
        question={pergunta}
        resposta={respostaAtual}
        status={status}
        onSelecionarOpcao={selecionarOpcao}
        onVoltar={voltar}
        onAvancar={avancar}
        onTentarNovamente={tentarNovamente}
        footer={chatInput}
      />
    </div>
  );
}