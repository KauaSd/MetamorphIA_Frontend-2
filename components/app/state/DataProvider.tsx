"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { buscarConversas, buscarPerfilMe } from "@/utils/data/apiRepository";
import { repository } from "@/utils/data/dataRepository";
import type { AppData } from "@/utils/data/types";

export interface DataContextValue extends AppData {
  hydrated: boolean;
  carregandoDadosBase: boolean;
  carregandoConversas: boolean;
  recarregar: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: ({ signal }) => buscarPerfilMe(signal),
    staleTime: 30 * 1000,
  });

  const escolasQuery = useQuery({
    queryKey: ["escolas"],
    queryFn: ({ signal }) => repository.listEscolas(signal),
  });

  const turmasQuery = useQuery({
    queryKey: ["turmas"],
    queryFn: ({ signal }) => repository.listTurmas(signal),
  });

  const alunosQuery = useQuery({
    queryKey: ["alunos"],
    queryFn: ({ signal }) => repository.listAlunos(signal),
  });

  const alunos = useMemo(() => alunosQuery.data ?? [], [alunosQuery.data]);
  const alunoIds = useMemo(() => alunos.map((a) => a.id), [alunos]);

  const conversasQuery = useQuery({
    queryKey: ["conversas", alunoIds],
    queryFn: ({ signal }) => buscarConversas(alunoIds, signal),
    enabled: alunosQuery.isSuccess,
  });

  const recarregar = useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);

  // hydrated libera a UI assim que os dados base chegam, sem bloquear pelas conversas
  const hydrated =
    !meQuery.isPending &&
    !escolasQuery.isPending &&
    !turmasQuery.isPending &&
    !alunosQuery.isPending;

  const perfil = meQuery.data ?? null;
  const teacherName = perfil?.nome_usuario || null;
  const nomeReal = perfil?.nome_real || null;
  const tipoUsuario = perfil?.tipo_usuario || null;
  const tipoNorm = (tipoUsuario ?? "").trim().toLowerCase();
  const modoAtivo = perfil?.modo_ativo ?? null;
  const escolaAdmId =
    perfil?.escola_adm_id !== null && perfil?.escola_adm_id !== undefined
      ? String(perfil.escola_adm_id)
      : null;

  const permissoes = perfil?.permissoes;
  const ehAdminRede = Boolean(
    permissoes?.eh_admin_rede ?? tipoNorm === "adm_institucional",
  );
  const podeAlternarModoProfessor = Boolean(
    permissoes?.pode_alternar_modo_professor ?? tipoNorm === "adm_escola",
  );
  const podeAcessarPainelAdm = Boolean(
    permissoes?.pode_acessar_painel_adm ??
      (ehAdminRede ||
        (tipoNorm === "adm_escola" && modoAtivo !== "professor") ||
        tipoNorm === "adm" ||
        tipoNorm === "admin" ||
        tipoNorm === "administrador" ||
        tipoNorm === "gestor"),
  );
  const ehAdmin = podeAcessarPainelAdm;
  const podeGerenciarAlunos =
    permissoes?.pode_gerenciar_alunos !== undefined
      ? Boolean(permissoes.pode_gerenciar_alunos)
      : tipoNorm !== "prof_institucional";
  const podeGerenciarTurmas =
    permissoes?.pode_gerenciar_turmas !== undefined
      ? Boolean(permissoes.pode_gerenciar_turmas)
      : tipoNorm !== "prof_institucional";
  const podeCriarEscolas =
    (permissoes?.pode_criar_escolas !== undefined
      ? Boolean(permissoes.pode_criar_escolas)
      : tipoNorm !== "prof_institucional") &&
    !(ehAdmin && !ehAdminRede);
  const podeChat =
    permissoes?.pode_chat !== undefined
      ? Boolean(permissoes.pode_chat)
      : perfil?.pode_chat !== undefined
        ? Boolean(perfil.pode_chat)
        : !ehAdminRede;

  const escolasEnriquecidas = useMemo(() => {
    const listaApi = escolasQuery.data ?? [];
    const listaMe = perfil?.escolas ?? [];
    if (listaMe.length === 0) return listaApi;

    const porIdMe = new Map(listaMe.map((e) => [String(e.id_escola), e]));
    if (listaApi.length === 0) {
      return listaMe.map((e) => ({
        id: String(e.id_escola),
        nome: e.nome_escola,
        plano: e.plano ?? null,
        institucional: Boolean(e.institucional),
        codigoConvite: e.codigo_convite ?? null,
        papel: e.papel ?? null,
      }));
    }

    return listaApi.map((escola) => {
      const me = porIdMe.get(escola.id);
      if (!me) return escola;
      return {
        ...escola,
        plano: escola.plano ?? me.plano ?? null,
        institucional: escola.institucional || Boolean(me.institucional),
        codigoConvite: escola.codigoConvite ?? me.codigo_convite ?? null,
        papel: escola.papel ?? me.papel ?? null,
      };
    });
  }, [escolasQuery.data, perfil?.escolas]);

  const escolasVisiveis = useMemo(() => {
    if (!ehAdmin) return escolasEnriquecidas;
    const ehInstitucional = (e: (typeof escolasEnriquecidas)[number]) =>
      Boolean(e.institucional) ||
      (e.plano ?? "").toLowerCase().includes("institucional") ||
      (escolaAdmId !== null && e.id === escolaAdmId);

    if (ehAdminRede || escolasEnriquecidas.some(ehInstitucional)) {
      return escolasEnriquecidas.filter(ehInstitucional);
    }
    return escolasEnriquecidas;
  }, [ehAdmin, ehAdminRede, escolaAdmId, escolasEnriquecidas]);

  const plano = perfil?.plano ?? null;
  const escolaInstitucional = Boolean(
    perfil?.escola_institucional ||
      escolasEnriquecidas.some(
        (e) => e.institucional || (e.plano ?? "").toLowerCase().includes("institucional"),
      ),
  );
  const perfilProfessorFeito = Boolean(
    perfil?.perfil_professor_feito ?? perfil?.nome_real?.trim(),
  );
  const identificacaoFeita = Boolean(
    perfil?.identificacao_feita ?? perfil?.nome_usuario?.trim(),
  );
  const tutorialVisto = Boolean(perfil?.tutorial_visto);
  const tutorialInstitucionalVisto = Boolean(
    perfil?.tutorial_institucional_visto ?? perfil?.tutorial_visto,
  );

  const valor = useMemo<DataContextValue>(
    () => ({
      teacherName,
      nomeReal,
      tipoUsuario,
      modoAtivo,
      escolaAdmId,
      ehAdmin,
      ehAdminRede,
      podeAlternarModoProfessor,
      podeAcessarPainelAdm,
      podeGerenciarAlunos,
      podeGerenciarTurmas,
      podeCriarEscolas,
      podeChat,
      plano,
      escolaInstitucional,
      perfilProfessorFeito,
      identificacaoFeita,
      tutorialVisto,
      tutorialInstitucionalVisto,
      escolas: escolasVisiveis,
      turmas: turmasQuery.data ?? [],
      alunos,
      conversas: conversasQuery.data ?? [],
      hydrated,
      carregandoDadosBase: !hydrated,
      carregandoConversas: conversasQuery.isPending || conversasQuery.isFetching,
      recarregar,
    }),
    [
      teacherName,
      nomeReal,
      tipoUsuario,
      modoAtivo,
      escolaAdmId,
      ehAdmin,
      ehAdminRede,
      podeAlternarModoProfessor,
      podeAcessarPainelAdm,
      podeGerenciarAlunos,
      podeGerenciarTurmas,
      podeCriarEscolas,
      podeChat,
      plano,
      escolaInstitucional,
      perfilProfessorFeito,
      identificacaoFeita,
      tutorialVisto,
      tutorialInstitucionalVisto,
      escolasVisiveis,
      turmasQuery.data,
      alunos,
      conversasQuery.data,
      conversasQuery.isPending,
      conversasQuery.isFetching,
      hydrated,
      recarregar,
    ],
  );

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const contexto = useContext(DataContext);

  if (!contexto) {
    throw new Error("useData precisa estar dentro de <DataProvider>");
  }

  return contexto;
}
