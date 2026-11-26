"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Menu from "@/components/app/layout/Menu";
import Tutorial, { type tutId } from "@/components/app/layout/Tutorial";
import {
  FormIdentificacao,
  FormIdentificacaoProfessor,
} from "@/components/app/forms/FormAlunoTurma";
import FormVincularInstituicao from "@/components/app/forms/FormVincularInstituicao";
import { useData } from "@/components/app/state/DataProvider";
import { alternarModo, markTutorialSeen } from "@/utils/data/controller";
import StatusPlano, { type TipoPlanoStatus } from "@/components/app/layout/StatusPlano";

const ROTAS_SOMENTE_PROFESSOR = ["/alunos", "/dashboardAluno", "/recentes", "/chat"];

function VincularInstituicaoPorLink({
  onSucesso,
}: {
  onSucesso: () => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [dispensado, setDispensado] = useState(false);

  const paramVincular = searchParams.get("vincular");
  const paramConvite = searchParams.get("convite");
  const paramCodigo = searchParams.get("codigo");
  const paramInstituicao = searchParams.get("instituicao");

  const deveAbrir =
    !dispensado &&
    (pathname === "/vincular-instituicao" ||
      paramVincular === "1" ||
      paramVincular === "true" ||
      paramConvite !== null ||
      paramCodigo !== null);

  if (!deveAbrir) return null;

  const conviteId =
    paramConvite && paramConvite !== "1" && paramConvite !== "true" ? paramConvite : undefined;

  function fecharModal() {
    setDispensado(true);
    if (pathname === "/vincular-instituicao") {
      router.replace("/escolas");
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("vincular");
    params.delete("convite");
    params.delete("codigo");
    params.delete("escola");
    params.delete("instituicao");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <FormVincularInstituicao
      conviteId={conviteId}
      nomeInstituicao={paramInstituicao ?? undefined}
      codigoInicial={paramCodigo ?? ""}
      onClose={fecharModal}
      onSucesso={onSucesso}
    />
  );
}

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const ehChat = pathname?.startsWith("/chat");
  const {
    hydrated,
    teacherName,
    plano,
    ehAdminRede,
    podeAlternarModoProfessor,
    modoAtivo,
    escolaInstitucional,
    escolas,
    perfilProfessorFeito,
    identificacaoFeita,
    tutorialVisto,
    tutorialInstitucionalVisto,
    recarregar,
  } = useData();
  const [passoTutorial, setPassoTutorial] = useState<tutId | null>(null);
  const [perfilDispensado, setPerfilDispensado] = useState(false);
  const [alternandoModo, setAlternandoModo] = useState(false);

  async function handleAlternarModo() {
    if (alternandoModo) return;
    const indoParaModoAdm = modoAtivo === "professor";
    setAlternandoModo(true);
    try {
      const resultado = await alternarModo();
      if (resultado.ok) {
        await recarregar();
        if (
          indoParaModoAdm &&
          ROTAS_SOMENTE_PROFESSOR.some((rota) => pathname?.startsWith(rota))
        ) {
          router.replace("/escolas");
        }
      }
    } finally {
      setAlternandoModo(false);
    }
  }

  const contaInstitucional = (plano ?? "").toLowerCase().includes("institucional");
  const temEscolaInstitucional =
    escolaInstitucional ||
    escolas.some(
      (esc) =>
        esc.institucional ||
        (esc.plano ?? "").toLowerCase().includes("institucional"),
    );
  const ehInstitucional = contaInstitucional || temEscolaInstitucional;

  // Modal 1: nome real + materias que leciona (nao se aplica a ADM de Rede sem chat)
  const precisaPerfilProfessor =
    hydrated && !ehAdminRede && !perfilProfessorFeito && !perfilDispensado;
  // Modal 2: como a IA vai chamar (so aparece depois do Modal 1)
  const precisaIdentificar =
    hydrated && !precisaPerfilProfessor && (!identificacaoFeita || teacherName === null);
  const mostrarTutorialInstitucional =
    hydrated &&
    ehInstitucional &&
    !tutorialInstitucionalVisto &&
    !precisaPerfilProfessor &&
    !precisaIdentificar;

  const handleSalvarPerfilProfessor = async () => {
    setPerfilDispensado(true);
    await recarregar();
  };

  // quem acabou de responder "Como devemos te chamar?" ve o tutorial normal
  const handleSalvarIdentificacao = async () => {
    await recarregar();
    if (!ehInstitucional && !tutorialVisto) {
      setPassoTutorial("1");
    }
  };

  const handleFecharTutorial = async (variante: "padrao" | "institucional") => {
    setPassoTutorial(null);
    await markTutorialSeen(variante);
    await recarregar();
  };

  const varianteAtiva = mostrarTutorialInstitucional ? "institucional" : "padrao";
  const exibirTutorial =
    mostrarTutorialInstitucional || Boolean(passoTutorial && !tutorialVisto && !ehInstitucional);
  const planoNormalizado = (plano ?? "").trim().toLowerCase();
  const emModoProfessor = podeAlternarModoProfessor && modoAtivo === "professor";
  const planoIndividualPro =
    planoNormalizado === "pro" ||
    escolas.some(
      (esc) => !esc.institucional && (esc.plano ?? "").trim().toLowerCase() === "pro",
    );
  const tipoPlano: TipoPlanoStatus = emModoProfessor
    ? planoIndividualPro
      ? "pro"
      : "basico"
    : ehInstitucional
      ? "institucional"
      : planoNormalizado === "pro"
        ? "pro"
        : "basico";

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Menu />
      <main className={`flex flex-1 min-w-0 flex-col ${ehChat ? "" : "pt-14 md:pt-0"}`}>
        {children}
      </main>
      <StatusPlano
        tipo={tipoPlano}
        onClick={podeAlternarModoProfessor ? () => void handleAlternarModo() : undefined}
        disabled={alternandoModo}
        title={
          podeAlternarModoProfessor
            ? modoAtivo === "professor"
              ? "Modo Professor ativo — clique para voltar ao Modo ADM"
              : "Modo ADM ativo — clique para entrar como Professor"
            : undefined
        }
        ariaLabel={
          podeAlternarModoProfessor
            ? modoAtivo === "professor"
              ? "Voltar para Modo ADM"
              : "Alternar para Modo Professor"
            : undefined
        }
      />
      {precisaPerfilProfessor && (
        <FormIdentificacaoProfessor
          onSalvar={handleSalvarPerfilProfessor}
          onClose={() => setPerfilDispensado(true)}
        />
      )}
      {precisaIdentificar && <FormIdentificacao onSalvar={handleSalvarIdentificacao} />}
      {exibirTutorial && (
        <Tutorial
          tipo={passoTutorial ?? "1"}
          variante={varianteAtiva}
          onClose={() => void handleFecharTutorial(varianteAtiva)}
        />
      )}
      <Suspense fallback={null}>
        <VincularInstituicaoPorLink onSucesso={recarregar} />
      </Suspense>
    </div>
  );
}
