"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import Menu from "@/components/app/layout/Menu";
import Tutorial, { type tutId } from "@/components/app/layout/Tutorial";
import { FormIdentificacao } from "@/components/app/forms/FormAlunoTurma";
import FormVincularInstituicao from "@/components/app/forms/FormVincularInstituicao";
import { useData } from "@/components/app/state/DataProvider";
import { getAuthToken } from "@/utils/apiClient";
import { alternarModo, markTutorialSeen } from "@/utils/data/controller";
import StatusPlano, { resolverTipoPlano, type TipoPlanoStatus } from "@/components/app/layout/StatusPlano";

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

function StatusPlanoContextual({
  alternandoModo,
  onAlternarModo,
}: {
  alternandoModo: boolean;
  onAlternarModo: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    plano,
    escolas,
    turmas,
    alunos,
    conversas,
    escolaInstitucional,
    podeAlternarModoProfessor,
    modoAtivo,
    ehAdmin,
  } = useData();

  let escolaAtualId: string | null = null;
  if (pathname === "/dashboardEscola") {
    escolaAtualId = searchParams.get("id");
  } else if (pathname === "/dashboardTurma") {
    const turmaId = searchParams.get("id");
    escolaAtualId = turmas.find((t) => t.id === turmaId)?.escolaId ?? null;
  } else if (pathname === "/dashboardAluno") {
    const alunoId = searchParams.get("id");
    const aluno = alunos.find((a) => a.id === alunoId);
    escolaAtualId = aluno
      ? turmas.find((t) => t.id === aluno.turmaId)?.escolaId ?? null
      : null;
  } else if (pathname === "/chat") {
    const alunoIdParam =
      searchParams.get("alunoId") ??
      conversas.find((c) => c.id === searchParams.get("conversaId"))?.alunoId ??
      null;
    const aluno = alunos.find((a) => a.id === alunoIdParam);
    escolaAtualId = aluno
      ? turmas.find((t) => t.id === aluno.turmaId)?.escolaId ?? null
      : null;
  }

  const tipoPlano: TipoPlanoStatus = resolverTipoPlano({
    plano,
    escolas,
    escolaInstitucional,
    podeAlternarModoProfessor,
    modoAtivo,
    ehAdmin,
    escolaAtualId,
  });

  return (
    <StatusPlano
      tipo={tipoPlano}
      onClick={podeAlternarModoProfessor ? onAlternarModo : undefined}
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
  );
}

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const ehChat = pathname?.startsWith("/chat");
  const {
    hydrated,
    teacherName,
    tipoUsuario,
    plano,
    ehAdminRede,
    podeAlternarModoProfessor,
    modoAtivo,
    escolaInstitucional,
    escolas,
    identificacaoFeita,
    tutorialVisto,
    tutorialInstitucionalVisto,
    recarregar,
  } = useData();
  const [passoTutorial, setPassoTutorial] = useState<tutId | null>(null);
  const [alternandoModo, setAlternandoModo] = useState(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);

  useEffect(() => {
    const temToken = Boolean(getAuthToken());
    setAutenticado(temToken);
    if (!temToken) {
      router.replace("/auth/login");
    }
  }, [pathname, hydrated, router]);

  if (autenticado !== true) {
    return <CarregandoDashboard mensagem="Verificando acesso..." />;
  }

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

  const perfilCarregado = hydrated && Boolean(tipoUsuario);

  // Identificação inicial única: pede nome completo e define também como a IA chama o usuário
  const precisaIdentificar =
    perfilCarregado && !ehAdminRede && (!identificacaoFeita || teacherName === null);
  const mostrarTutorialInstitucional =
    perfilCarregado &&
    ehInstitucional &&
    !tutorialInstitucionalVisto &&
    !precisaIdentificar;

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
    if (pathname !== "/escolas") {
      router.push("/escolas");
    }
  };

  const varianteAtiva = mostrarTutorialInstitucional ? "institucional" : "padrao";
  const exibirTutorial =
    mostrarTutorialInstitucional || Boolean(passoTutorial && !tutorialVisto && !ehInstitucional);

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Menu />
      <main className={`flex flex-1 min-w-0 flex-col ${ehChat ? "" : "pt-14 md:pt-0"}`}>
        {children}
      </main>
      <Suspense fallback={null}>
        <StatusPlanoContextual
          alternandoModo={alternandoModo}
          onAlternarModo={() => void handleAlternarModo()}
        />
      </Suspense>
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
