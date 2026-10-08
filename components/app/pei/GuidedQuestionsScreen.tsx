"use client";

import { usePeiFlow } from "@/components/app/state/PeiFlowProvider";
import InfoNotice from "@/components/app/pei/InfoNotice";
import QuestionCard from "@/components/app/pei/QuestionCard";

export default function GuidedQuestionsScreen() {
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
  if (!aluno || !pergunta) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      <InfoNotice />
      <QuestionCard
        alunoNome={aluno.nome}
        componente={componente}
        question={pergunta}
        index={currentIndex}
        resposta={respostaAtual}
        status={status}
        onSelecionarOpcao={selecionarOpcao}
        onVoltar={voltar}
        onAvancar={avancar}
        onTentarNovamente={tentarNovamente}
      />
    </div>
  );
}