import {
  apiAiGatewayOrDirect,
  apiDbFetch,
  getAuthToken,
  getSavedUserProfile,
  parseNumeroId,
  setSavedUserProfile,
  type UserProfile,
} from "@/utils/apiClient";
import { obterOpcoesComponente } from "@/utils/pei/opcoes";
import type { DataRepository } from "./dataRepository";
import {
  hojeDDMMAAAA,
  type Aluno,
  type ClassInsights,
  type Conversa,
  type CorIndicador,
  type EngajamentoMateria,
  type Escola,
  type IndicadorDesenvolvimento,
  type Mensagem,
  type MetaBimestreItem,
  type PeiDisciplinaItem,
  type PeisPorDisciplinaResumo,
  type StatusMetaBimestre,
  type StatusPeiDisciplina,
  type StudentInsights,
  type Turma,
} from "./types";

const ENGAJAMENTO_ZERADO: EngajamentoMateria[] = [
  { rotulo: "Leitura e Escrita", materia: "leitura", percentual: 0 },
  { rotulo: "Matemática", materia: "matematica", percentual: 0 },
  { rotulo: "Ciências", materia: "ciencias", percentual: 0 },
];

function criarPeisDisciplinaNaoIniciada(): PeisPorDisciplinaResumo {
  const perfil = getSavedUserProfile();
  const opcoes = obterOpcoesComponente(
    perfil?.tags?.length ? perfil.tags : perfil?.tags_areas,
  );
  const disciplinas: PeiDisciplinaItem[] = opcoes.map((op) => ({
    id: op.value,
    disciplina: op.label,
    status: "nao_iniciado",
  }));
  return {
    statusGeral: "NÃO INICIADA",
    concluidos: 0,
    total: disciplinas.length,
    disciplinas,
    ultimoEnvio: null,
    proximoPeriodo: null,
  };
}

const METAS_BIMESTRE_PADRAO: MetaBimestreItem[] = [];

const INDICADORES_PADRAO: IndicadorDesenvolvimento[] = [
  {
    id: "autonomia",
    titulo: "Autonomia nas Atividades",
    escalaEsquerda: "Precisa de apoio",
    escalaCentro: "Com pistas",
    escalaDireita: "Faz sozinho",
    nivel: 0,
    cor: "warning",
  },
  {
    id: "foco",
    titulo: "Foco e Atenção",
    escalaEsquerda: "Disperso",
    escalaCentro: "Oscila",
    escalaDireita: "Sustentado",
    nivel: 0,
    cor: "accent",
  },
  {
    id: "regulacao",
    titulo: "Regulação Emocional",
    escalaEsquerda: "Sensível",
    escalaCentro: "Em adaptação",
    escalaDireita: "Estável",
    nivel: 0,
    cor: "info",
  },
  {
    id: "engajamento",
    titulo: "Engajamento com Adaptações",
    escalaEsquerda: "Baixo",
    escalaCentro: "Moderado",
    escalaDireita: "Alto",
    nivel: 0,
    cor: "success",
  },
];

function normalizarStatusPei(status?: string): StatusPeiDisciplina {
  const s = (status ?? "").toLowerCase();
  if (s.includes("conclu") || s.includes("pronto") || s.includes("enviado")) return "concluido";
  if (s.includes("andamento") || s.includes("progresso")) return "em_andamento";
  return "nao_iniciado";
}

function normalizarStatusMeta(status?: string): StatusMetaBimestre {
  const s = (status ?? "").toLowerCase();
  if (s.includes("atingid") || s.includes("conclu")) return "atingida";
  if (s.includes("iniciar") || s.includes("pendente")) return "a_iniciar";
  return "em_progresso";
}

function normalizarCorIndicador(cor?: string, index = 0): CorIndicador {
  if (cor === "warning" || cor === "accent" || cor === "info" || cor === "success") return cor;
  const ciclo: CorIndicador[] = ["warning", "accent", "info", "success"];
  return ciclo[index % ciclo.length];
}

// Mantém apenas conversas recém-abertas em memória na sessão atual até a primeira mensagem ir para a API
const conversasEmMemoria = new Map<string, Conversa>();

function formatarIsoParaDDMMAAAA(iso?: string | null): string {
  if (!iso) return hojeDDMMAAAA();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(iso)) return iso;
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return hojeDDMMAAAA();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}

function splitNeuro(neurodiv?: string | null): string[] {
  if (!neurodiv) return [];
  return String(neurodiv)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapearEngajamento(areas?: Record<string, number> | null): EngajamentoMateria[] {
  if (!areas) return ENGAJAMENTO_ZERADO;
  return [
    {
      rotulo: "Leitura e Escrita",
      materia: "leitura",
      percentual: Number(areas.leitura ?? areas.escrita ?? 0),
    },
    {
      rotulo: "Matemática",
      materia: "matematica",
      percentual: Number(areas.matematica ?? 0),
    },
    {
      rotulo: "Ciências",
      materia: "ciencias",
      percentual: Number(areas.ciencias ?? 0),
    },
  ];
}

export class ApiError extends Error {
  status: number;
  codigoErro?: string;
  tipoLimite?: string;

  constructor(
    message: string,
    status: number,
    codigoErro?: string,
    tipoLimite?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.codigoErro = codigoErro;
    this.tipoLimite = tipoLimite;
  }
}

interface DetailObjetoApi {
  codigo_erro?: string;
  tipo_limite?: string;
  mensagem?: string;
  message?: string;
  msg?: string;
  erro?: string;
  detail?: string;
}

async function extrairErroApi(resp: Response, fallback: string): Promise<ApiError> {
  try {
    const json = (await resp.json()) as {
      detail?: string | Array<{ msg?: string }> | DetailObjetoApi;
      codigo_erro?: string;
      tipo_limite?: string;
    };
    if (typeof json.detail === "string" && json.detail.trim()) {
      return new ApiError(json.detail, resp.status, json.codigo_erro, json.tipo_limite);
    }
    if (Array.isArray(json.detail) && json.detail.length > 0) {
      const msg = json.detail.map((d) => d.msg || "Erro de validação").join("; ");
      return new ApiError(msg, resp.status, json.codigo_erro, json.tipo_limite);
    }
    if (typeof json.detail === "object" && json.detail !== null && !Array.isArray(json.detail)) {
      const det = json.detail;
      const codigoErro = det.codigo_erro ?? json.codigo_erro;
      const tipoLimite = det.tipo_limite ?? json.tipo_limite;
      const mensagem =
        det.mensagem || det.message || det.msg || det.erro || det.detail || "";
      return new ApiError(
        mensagem.trim() || `${fallback} (HTTP ${resp.status})`,
        resp.status,
        codigoErro,
        tipoLimite,
      );
    }
    if (json.codigo_erro || json.tipo_limite) {
      return new ApiError(
        `${fallback} (HTTP ${resp.status})`,
        resp.status,
        json.codigo_erro,
        json.tipo_limite,
      );
    }
  } catch {}
  return new ApiError(`${fallback} (HTTP ${resp.status})`, resp.status);
}

function exigirToken(): void {
  if (!getAuthToken()) {
    throw new Error("Sessão não autenticada. Faça login novamente.");
  }
}

/**
 * Busca resumos de conversas para uma lista de alunos.
 * Isolada aqui para trocar facilmente pelo endpoint em lote
 * `GET /conversas?aluno_ids=7,8,9,10` quando o backend estiver pronto.
 */
export async function buscarConversas(
  alunoIds: string[],
  signal?: AbortSignal,
): Promise<Conversa[]> {
  if (!getAuthToken() || alunoIds.length === 0) return [];

  const porId = new Map<string, Conversa>();
  for (const [cid, conv] of conversasEmMemoria.entries()) {
    porId.set(cid, conv);
  }

  await Promise.all(
    alunoIds.map(async (alunoId) => {
      const numAluno = parseNumeroId(alunoId);
      if (numAluno === null) return;
      try {
        const resp = await apiAiGatewayOrDirect(
          `/AI/chat/aluno/${numAluno}/conversas`,
          `/alunos/${numAluno}/conversas`,
          { signal },
        );
        if (!resp.ok) return;
        const resumos = (await resp.json()) as Array<{
          conversa_id: string;
          titulo: string;
          data: string;
        }>;
        if (!Array.isArray(resumos)) return;

        for (const resumo of resumos) {
          const cid = resumo.conversa_id;
          if (!cid) continue;
          const emMemoria = conversasEmMemoria.get(cid);
          const conversaApi: Conversa = {
            id: cid,
            alunoId,
            titulo: resumo.titulo || "Nova conversa",
            data: formatarIsoParaDDMMAAAA(resumo.data),
            mensagens: emMemoria?.mensagens ?? [],
          };
          if (emMemoria?.mensagens?.length) {
            conversasEmMemoria.set(cid, conversaApi);
          }
          porId.set(cid, conversaApi);
        }
      } catch {}
    }),
  );

  return Array.from(porId.values());
}

/**
 * Busca centralizada do perfil do usuário autenticado (/autenticar/me).
 */
export async function buscarPerfilMe(signal?: AbortSignal): Promise<UserProfile | null> {
  if (!getAuthToken()) return null;
  try {
    const resp = await apiDbFetch("/autenticar/me", { signal });
    if (resp.ok) {
      const perfil = (await resp.json()) as UserProfile;
      setSavedUserProfile(perfil);
      return perfil;
    }
  } catch {}
  return getSavedUserProfile();
}

export interface ProfessorEscolaApi {
  id_usuario: number;
  nome_usuario: string;
  email_usuario?: string | null;
  telefone_usuario?: string | null;
  tipo_usuario?: string | null;
  papel?: string | null;
  pode_chat?: boolean;
  tags_areas?: string[];
  turma?: string | null;
  concluidos?: number;
  total?: number;
  peis_concluidos?: number;
  peis_total?: number;
  percentual?: number;
  ultimo_envio?: string | null;
  proximo_periodo?: string | null;
}

export interface EscolaPeisResumoApi {
  id_escola: number;
  concluidos: number;
  total: number;
  percentual: number;
  ultimo_envio?: string | null;
  proximo_periodo?: string | null;
  professores?: ProfessorEscolaApi[];
}

export interface ConviteDetalheApi {
  id_convite: number;
  nome_escola: string;
  convidado_por?: string | null;
  tags_areas?: string[];
  status?: string | null;
}

export interface ConviteCriadoApi {
  id_convite: number;
  link_convite?: string | null;
  email_enviado?: boolean;
  codigo_convite?: string | null;
}

export async function enviarConviteProfessorEscola(
  escolaId: string,
  dados: { email: string; tags_areas?: string[]; link_base?: string },
): Promise<ConviteCriadoApi> {
  exigirToken();
  const numId = parseNumeroId(escolaId);
  if (numId === null) {
    throw new Error("Selecione uma escola válida para enviar o convite.");
  }
  const resp = await apiDbFetch(`/escolas/${numId}/convites`, {
    method: "POST",
    body: JSON.stringify({
      email: dados.email,
      tags_areas: dados.tags_areas ?? [],
      link_base:
        dados.link_base ??
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
    }),
  });
  if (!resp.ok) {
    throw await extrairErroApi(resp, "Não foi possível enviar o convite");
  }
  return (await resp.json()) as ConviteCriadoApi;
}

export async function buscarDetalheConvite(
  idConvite: string | number,
  signal?: AbortSignal,
): Promise<ConviteDetalheApi | null> {
  const numId = parseNumeroId(idConvite);
  if (numId === null) return null;
  try {
    const resp = await apiDbFetch(`/escolas/convites/${numId}`, { signal });
    if (!resp.ok) return null;
    return (await resp.json()) as ConviteDetalheApi;
  } catch {
    return null;
  }
}

export async function aceitarConviteEscola(dados: {
  codigo_convite: string;
  id_convite?: number | null;
}): Promise<void> {
  exigirToken();
  const payload: { codigo_convite: string; id_convite?: number } = {
    codigo_convite: dados.codigo_convite,
  };
  if (dados.id_convite != null) {
    payload.id_convite = dados.id_convite;
  }
  const resp = await apiDbFetch("/escolas/convites/aceitar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw await extrairErroApi(resp, "Não foi possível aceitar o convite");
  }
}

export async function recusarConviteEscola(idConvite: number): Promise<void> {
  exigirToken();
  const resp = await apiDbFetch(`/escolas/convites/${idConvite}/recusar`, {
    method: "POST",
  });
  if (!resp.ok) {
    throw await extrairErroApi(resp, "Não foi possível recusar o convite");
  }
}

export async function buscarResumoPeisEscola(
  escolaId: string,
  signal?: AbortSignal,
): Promise<EscolaPeisResumoApi | null> {
  const numId = parseNumeroId(escolaId);
  if (numId === null || !getAuthToken()) return null;
  try {
    const resp = await apiDbFetch(`/escolas/${numId}/peis/resumo`, { signal });
    if (!resp.ok) return null;
    return (await resp.json()) as EscolaPeisResumoApi;
  } catch {
    return null;
  }
}

export async function listarProfessoresEscola(
  escolaId: string,
  signal?: AbortSignal,
): Promise<ProfessorEscolaApi[]> {
  const numId = parseNumeroId(escolaId);
  if (numId === null || !getAuthToken()) return [];
  try {
    const resp = await apiDbFetch(`/escolas/${numId}/professores`, { signal });
    if (!resp.ok) return [];
    const dados = await resp.json();
    return Array.isArray(dados) ? (dados as ProfessorEscolaApi[]) : [];
  } catch {
    return [];
  }
}

export async function alternarModoConta(): Promise<UserProfile | null> {
  exigirToken();
  const resp = await apiDbFetch("/autenticar/alternar-modo", {
    method: "POST",
  });
  if (!resp.ok) {
    throw await extrairErroApi(resp, "Não foi possível alternar o modo da conta");
  }
  return buscarPerfilMe();
}

export const apiRepository: DataRepository = {
  async listEscolas(signal?: AbortSignal): Promise<Escola[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/escolas", { signal });
    if (!resp.ok) return [];
    const dados = (await resp.json()) as Array<{
      id_escola: number;
      nome_escola: string;
      plano?: string | null;
      plano_escola?: string | null;
      institucional?: boolean;
      codigo_convite?: string | null;
      papel?: string | null;
    }>;
    if (!Array.isArray(dados)) return [];
    return dados.map((e) => ({
      id: String(e.id_escola),
      nome: e.nome_escola,
      plano: e.plano ?? e.plano_escola ?? null,
      institucional: Boolean(e.institucional),
      codigoConvite: e.codigo_convite ?? null,
      papel: e.papel ?? null,
    }));
  },

  async createEscola(input): Promise<Escola> {
    exigirToken();
    const resp = await apiDbFetch("/escolas", {
      method: "POST",
      body: JSON.stringify({ nome_escola: input.nome }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível criar a escola");
    }
    const criado = (await resp.json()) as { id_escola: number; nome_escola: string };
    return {
      id: String(criado.id_escola),
      nome: criado.nome_escola ?? input.nome,
    };
  },

  async updateEscola(id, input): Promise<Escola> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID da escola inválido.");
    const resp = await apiDbFetch(`/escolas/${numId}`, {
      method: "PUT",
      body: JSON.stringify({ nome_escola: input.nome }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível atualizar a escola");
    }
    const atualizado = (await resp.json()) as { id_escola: number; nome_escola: string };
    return {
      id: String(atualizado.id_escola ?? numId),
      nome: atualizado.nome_escola ?? input.nome,
    };
  },

  async deleteEscola(id): Promise<void> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID da escola inválido.");
    const resp = await apiDbFetch(`/escolas/${numId}`, { method: "DELETE" });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível excluir a escola");
    }
  },

  async listTurmas(signal?: AbortSignal): Promise<Turma[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/turma", { signal });
    if (!resp.ok) return [];
    const dados = (await resp.json()) as Array<{
      id_turma: number;
      nome_turma: string;
      id_escola?: number | null;
      serie_ano?: string | null;
      letra?: string | null;
      horario?: string | null;
    }>;
    if (!Array.isArray(dados)) return [];
    return dados.map((t) => ({
      id: String(t.id_turma),
      nome: t.nome_turma,
      ...(t.id_escola ? { escolaId: String(t.id_escola) } : {}),
      ...(t.serie_ano ? { serieAno: t.serie_ano } : {}),
      ...(t.letra ? { letra: t.letra } : {}),
      ...(t.horario ? { horario: t.horario } : {}),
    }));
  },

  async createTurma(input): Promise<Turma> {
    exigirToken();
    const idEscolaNum = parseNumeroId(input.escolaId);
    const resp = await apiDbFetch("/turma/AdicionarTurma", {
      method: "POST",
      body: JSON.stringify({
        nome: input.nome,
        ...(idEscolaNum ? { id_escola: idEscolaNum } : {}),
        ...(input.serieAno ? { serie_ano: input.serieAno } : {}),
        ...(input.letra ? { letra: input.letra } : {}),
        ...(input.horario ? { horario: input.horario } : {}),
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível criar a turma");
    }
    const criado = (await resp.json()) as {
      id_turma: number;
      nome_turma: string;
      id_escola?: number;
      serie_ano?: string | null;
      letra?: string | null;
      horario?: string | null;
    };
    return {
      id: String(criado.id_turma),
      nome: criado.nome_turma ?? input.nome,
      ...(criado.id_escola
        ? { escolaId: String(criado.id_escola) }
        : input.escolaId
          ? { escolaId: input.escolaId }
          : {}),
      ...(criado.serie_ano ?? input.serieAno ? { serieAno: criado.serie_ano ?? input.serieAno } : {}),
      ...(criado.letra ?? input.letra ? { letra: criado.letra ?? input.letra } : {}),
      ...(criado.horario ?? input.horario ? { horario: criado.horario ?? input.horario } : {}),
    };
  },

  async updateTurma(id, input): Promise<Turma> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID da turma inválido.");
    const idEscolaNum = parseNumeroId(input.escolaId);
    const resp = await apiDbFetch(`/turma/${numId}`, {
      method: "PUT",
      body: JSON.stringify({
        nome: input.nome,
        ...(idEscolaNum ? { id_escola: idEscolaNum } : {}),
        ...(input.serieAno ? { serie_ano: input.serieAno } : {}),
        ...(input.letra !== undefined ? { letra: input.letra || null } : {}),
        ...(input.horario !== undefined ? { horario: input.horario || null } : {}),
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível atualizar a turma");
    }
    const atualizado = (await resp.json()) as {
      id_turma: number;
      nome_turma: string;
      id_escola?: number;
      serie_ano?: string | null;
      letra?: string | null;
      horario?: string | null;
    };
    return {
      id: String(atualizado.id_turma ?? numId),
      nome: atualizado.nome_turma ?? input.nome,
      ...(atualizado.id_escola ? { escolaId: String(atualizado.id_escola) } : {}),
      ...(atualizado.serie_ano ?? input.serieAno ? { serieAno: atualizado.serie_ano ?? input.serieAno } : {}),
      ...(atualizado.letra ? { letra: atualizado.letra } : {}),
      ...(atualizado.horario ? { horario: atualizado.horario } : {}),
    };
  },

  async deleteTurma(id): Promise<void> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID da turma inválido.");
    const resp = await apiDbFetch(`/turma/${numId}`, { method: "DELETE" });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível excluir a turma");
    }
  },

  async listAlunos(signal?: AbortSignal): Promise<Aluno[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/Alunos", { signal });
    if (!resp.ok) return [];
    const dados = (await resp.json()) as Array<{
      id_aluno: number;
      nome_aluno: string;
      idade_aluno?: number | null;
      neurodiv_aluno?: string | null;
      id_turma: number;
      desc_aluno?: string | null;
    }>;
    if (!Array.isArray(dados)) return [];
    return dados.map((a) => ({
      id: String(a.id_aluno),
      nome: a.nome_aluno,
      idade: a.idade_aluno ?? null,
      neuro: splitNeuro(a.neurodiv_aluno),
      turmaId: String(a.id_turma),
      descricao: a.desc_aluno ?? undefined,
    }));
  },

  async createAluno(input): Promise<Aluno> {
    exigirToken();
    const idTurmaNum = parseNumeroId(input.turmaId);
    if (idTurmaNum === null) throw new Error("Turma inválida.");
    const neuroStr = (input.neuro ?? []).join(", ") || "Não informada";
    const resp = await apiDbFetch("/Alunos/RecebeAluno", {
      method: "POST",
      body: JSON.stringify({
        nome: input.nome,
        idade: input.idade ?? 10,
        turma: idTurmaNum,
        neurodivergencia: neuroStr,
        descricao: "",
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível cadastrar o aluno");
    }
    const criado = (await resp.json()) as { id_aluno: number; id_turma: number };
    return {
      id: String(criado.id_aluno),
      nome: input.nome,
      idade: input.idade,
      neuro: input.neuro ?? [],
      turmaId: String(criado.id_turma ?? idTurmaNum),
    };
  },

  async updateAluno(id, input): Promise<Aluno> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID do aluno inválido.");

    const atuais = await this.listAlunos();
    const existente = atuais.find((a) => a.id === id);
    if (!existente) throw new Error("Aluno não encontrado.");

    const atualizado: Aluno = {
      ...existente,
      ...input,
      id: existente.id,
    };
    const idTurmaNum = parseNumeroId(atualizado.turmaId);
    if (idTurmaNum === null) throw new Error("Turma inválida.");
    const neuroStr = (atualizado.neuro ?? []).join(", ") || "Não informada";

    const resp = await apiDbFetch(`/Alunos/${numId}`, {
      method: "PUT",
      body: JSON.stringify({
        nome: atualizado.nome,
        idade: atualizado.idade ?? 10,
        turma: idTurmaNum,
        neurodivergencia: neuroStr,
        descricao: atualizado.descricao ?? "",
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível atualizar o aluno");
    }
    return atualizado;
  },

  async deleteAluno(id): Promise<void> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID do aluno inválido.");
    const resp = await apiDbFetch(`/Alunos/DeletaAluno/${numId}`, {
      method: "DELETE",
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível excluir o aluno");
    }
  },

  async listConversas(alunosJaCarregados?: Aluno[], signal?: AbortSignal): Promise<Conversa[]> {
    if (!getAuthToken()) return [];
    const alunos = alunosJaCarregados ?? (await this.listAlunos(signal));
    return buscarConversas(
      alunos.map((a) => a.id),
      signal,
    );
  },

  async getConversaMensagens(
    alunoId: string,
    conversaId: string,
    signal?: AbortSignal,
  ): Promise<Mensagem[]> {
    if (!getAuthToken()) return [];
    const numAluno = parseNumeroId(alunoId);
    if (numAluno === null || !conversaId) return [];

    try {
      const respDet = await apiAiGatewayOrDirect(
        `/AI/chat/aluno/${numAluno}/conversas/${conversaId}`,
        `/alunos/${numAluno}/conversas/${conversaId}`,
        { signal },
      );
      if (!respDet.ok) return [];
      const det = (await respDet.json()) as {
        mensagens?: Array<{
          role: string;
          conteudo: string;
          data: string;
          anexos?: Array<{
            name: string;
            type?: string;
            size?: number;
            dataUrl?: string;
          }>;
        }>;
      };
      return (det.mensagens ?? []).map((m, idx) => ({
        id: `${conversaId}_m_${idx}`,
        texto: m.conteudo,
        autor: m.role === "user" ? "professor" : "aluno",
        em: m.data || new Date().toISOString(),
        ...(m.anexos && m.anexos.length > 0
          ? {
              anexos: m.anexos.map((a) => ({
                name: a.name,
                type: a.type ?? "application/octet-stream",
                size: a.size ?? 0,
                dataUrl: a.dataUrl,
              })),
            }
          : {}),
      }));
    } catch {
      return [];
    }
  },

  async upsertConversa(conversa): Promise<Conversa> {
    conversasEmMemoria.set(conversa.id, conversa);
    return conversa;
  },

  async deleteConversa(id): Promise<void> {
    exigirToken();
    const alvo = conversasEmMemoria.get(id);
    conversasEmMemoria.delete(id);
    if (alvo) {
      const numAluno = parseNumeroId(alvo.alunoId);
      if (numAluno !== null) {
        const resp = await apiAiGatewayOrDirect(
          `/AI/chat/aluno/${numAluno}/conversas/${id}`,
          `/alunos/${numAluno}/conversas/${id}`,
          { method: "DELETE" },
        );
        if (!resp.ok && resp.status !== 404) {
          throw await extrairErroApi(resp, "Não foi possível excluir a conversa");
        }
      }
    }
  },

  async getTeacherName(signal?: AbortSignal): Promise<string | null> {
    const perfil = await buscarPerfilMe(signal);
    return perfil?.nome_usuario || null;
  },

  async getOnboardingStatus(): Promise<{
    perfilProfessorFeito: boolean;
    identificacaoFeita: boolean;
    tutorialVisto: boolean;
    tutorialInstitucionalVisto: boolean;
    escolaInstitucional: boolean;
    plano: string | null;
  }> {
    const perfil = getSavedUserProfile();
    const tutorialVisto = Boolean(perfil?.tutorial_visto);
    return {
      perfilProfessorFeito: Boolean(
        perfil?.perfil_professor_feito ?? perfil?.nome_real?.trim(),
      ),
      identificacaoFeita: Boolean(perfil?.identificacao_feita ?? perfil?.nome_usuario?.trim()),
      tutorialVisto,
      tutorialInstitucionalVisto: Boolean(
        perfil?.tutorial_institucional_visto ?? perfil?.tutorial_visto,
      ),
      escolaInstitucional: Boolean(perfil?.escola_institucional),
      plano: perfil?.plano ?? null,
    };
  },

  async markTutorialSeen(variante: "padrao" | "institucional" = "padrao"): Promise<void> {
    if (!getAuthToken()) return;
    const perfil = getSavedUserProfile();
    const ehInstitucional = variante === "institucional";
    if (perfil) {
      setSavedUserProfile({
        ...perfil,
        ...(ehInstitucional
          ? { tutorial_institucional_visto: true, tutorial_visto: true }
          : { tutorial_visto: true }),
      });
    }
    try {
      await apiDbFetch("/autenticar/tutorial", {
        method: "PATCH",
        body: JSON.stringify(
          ehInstitucional
            ? { tutorial_institucional_visto: true, tutorial_visto: true }
            : { tutorial_visto: true },
        ),
      });
    } catch {}
  },

  async saveProfessorPerfil(nomeReal: string, tags: string[]): Promise<void> {
    exigirToken();
    let perfil = getSavedUserProfile();
    if (!perfil) {
      const meResp = await apiDbFetch("/autenticar/me");
      if (meResp.ok) {
        perfil = await meResp.json();
        if (perfil) setSavedUserProfile(perfil);
      }
    }
    const resp = await apiDbFetch("/autenticar/EditaProfessor/", {
      method: "PUT",
      body: JSON.stringify({
        nomeReal,
        nomeProf: perfil?.nome_usuario || nomeReal,
        emailprof: perfil?.email_usuario ?? null,
        numprof: perfil?.telefone_usuario ?? null,
        tags,
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível salvar os dados do professor");
    }
    if (perfil) {
      setSavedUserProfile({
        ...perfil,
        nome_real: nomeReal,
        tags,
        perfil_professor_feito: true,
      });
    }
  },

  async saveTeacherName(nome: string): Promise<void> {
    exigirToken();
    let perfil = getSavedUserProfile();
    if (!perfil) {
      const meResp = await apiDbFetch("/autenticar/me");
      if (meResp.ok) {
        perfil = await meResp.json();
        if (perfil) setSavedUserProfile(perfil);
      }
    }
    const resp = await apiDbFetch("/autenticar/EditaProfessor/", {
      method: "PUT",
      body: JSON.stringify({
        nomeProf: nome,
        nomeReal: perfil?.nome_real ?? null,
        emailprof: perfil?.email_usuario ?? null,
        numprof: perfil?.telefone_usuario ?? null,
        tags: perfil?.tags ?? [],
      }),
    });
    if (!resp.ok) {
      throw await extrairErroApi(resp, "Não foi possível atualizar o perfil");
    }
    if (perfil) {
      setSavedUserProfile({
        ...perfil,
        nome_usuario: nome,
        identificacao_feita: true,
      });
    }
  },

  async getClassInsights(turmaId: string, signal?: AbortSignal): Promise<ClassInsights> {
    const numId = parseNumeroId(turmaId);
    if (numId !== null && getAuthToken()) {
      const resp = await apiAiGatewayOrDirect(
        `/AI/dashboard/turma/${numId}`,
        `/turmas/${numId}/dashboard`,
        { signal },
      );
      if (resp.ok) {
        const dados = (await resp.json()) as {
          alunos_com_pei_ativo?: number;
          adaptacoes_feitas?: number;
          resumo?: string;
          engajamento_por_area?: Record<string, number>;
        };
        return {
          alunosComPeiAtivo: dados.alunos_com_pei_ativo ?? 0,
          adaptacoesFeitas: dados.adaptacoes_feitas ?? 0,
          resumo: dados.resumo ?? "",
          engajamento: mapearEngajamento(dados.engajamento_por_area),
        };
      }
    }
    return {
      alunosComPeiAtivo: 0,
      adaptacoesFeitas: 0,
      resumo: "",
      engajamento: ENGAJAMENTO_ZERADO,
    };
  },

  async getStudentInsights(alunoId: string, signal?: AbortSignal): Promise<StudentInsights> {
    const numId = parseNumeroId(alunoId);
    if (numId !== null && getAuthToken()) {
      let resp: Response | null = null;
      try {
        resp = await apiAiGatewayOrDirect(
          `/AI/dashboard/aluno/${numId}`,
          `/alunos/${numId}/dashboard`,
          { signal },
        );
      } catch {}

      if (!resp || !resp.ok) {
        try {
          const respGateway = await apiDbFetch(`/AI/dashboard/aluno/${numId}`, { signal });
          if (respGateway.ok) {
            resp = respGateway;
          }
        } catch {}
      }
      if (resp && resp.ok) {
        const dados = (await resp.json()) as {
          atividades_adaptadas?: number;
          engajamento_percent?: number;
          pei_gerado?: boolean;
          perfil_ia?: string | null;
          descricao_breve?: string | null;
          desempenho_por_area?: Record<string, number>;
          peis_por_disciplina?: {
            status_geral?: string;
            concluidos?: number;
            total?: number;
            disciplinas?: Array<{ id?: string; disciplina?: string; nome?: string; status?: string }>;
            ultimo_envio?: string | null;
            proximo_periodo?: string | null;
            atrasado?: boolean;
            prazo_expirado?: boolean;
          };
          metas_bimestre?: Array<{ id?: string; titulo?: string; descricao?: string; status?: string }>;
          metas?: Array<{ id?: string; titulo?: string; descricao?: string; status?: string }>;
          indicadores_desenvolvimento?: Array<{
            id?: string;
            titulo?: string;
            escala_esquerda?: string;
            escala_centro?: string;
            escala_direita?: string;
            escalaEsquerda?: string;
            escalaCentro?: string;
            escalaDireita?: string;
            nivel?: number;
            cor?: string;
          }>;
          indicadores?: Array<{
            id?: string;
            titulo?: string;
            escala_esquerda?: string;
            escala_centro?: string;
            escala_direita?: string;
            escalaEsquerda?: string;
            escalaCentro?: string;
            escalaDireita?: string;
            nivel?: number;
            cor?: string;
          }>;
        };

        const peisPadrao = criarPeisDisciplinaNaoIniciada();
        const peisApi = dados.peis_por_disciplina;
        const disciplinasApi: PeiDisciplinaItem[] = (peisApi?.disciplinas ?? []).map(
          (d, idx): PeiDisciplinaItem => ({
            id: d.id ?? `pei_${idx}`,
            disciplina: d.disciplina ?? d.nome ?? "Disciplina",
            status: normalizarStatusPei(d.status),
          }),
        );
        const disciplinasFinais =
          disciplinasApi.length > 0 ? disciplinasApi : peisPadrao.disciplinas;
        const peisPorDisciplina: PeisPorDisciplinaResumo = peisApi
          ? {
              statusGeral: peisApi.status_geral ?? "NÃO INICIADA",
              concluidos: peisApi.concluidos ?? 0,
              total:
                disciplinasApi.length > 0
                  ? (peisApi.total ?? disciplinasApi.length)
                  : disciplinasFinais.length,
              disciplinas: disciplinasFinais,
              ultimoEnvio: peisApi.ultimo_envio ?? null,
              proximoPeriodo: peisApi.proximo_periodo ?? null,
              atrasado: Boolean(peisApi.atrasado ?? peisApi.prazo_expirado),
            }
          : peisPadrao;

        const metasRaw = dados.metas_bimestre ?? dados.metas;
        const metasDoBimestre: MetaBimestreItem[] = Array.isArray(metasRaw)
          ? metasRaw.map((m, idx) => ({
              id: m.id ?? `meta_${idx}`,
              titulo: m.titulo ?? m.descricao ?? "",
              status: normalizarStatusMeta(m.status),
            }))
          : METAS_BIMESTRE_PADRAO;

        const indicadoresRaw = dados.indicadores_desenvolvimento ?? dados.indicadores;
        const indicadoresDesenvolvimento: IndicadorDesenvolvimento[] =
          Array.isArray(indicadoresRaw) && indicadoresRaw.length > 0
            ? indicadoresRaw.map((ind, idx) => ({
              id: ind.id ?? `ind_${idx}`,
              titulo: ind.titulo ?? "",
              escalaEsquerda: ind.escala_esquerda ?? ind.escalaEsquerda ?? "",
              escalaCentro: ind.escala_centro ?? ind.escalaCentro ?? "",
              escalaDireita: ind.escala_direita ?? ind.escalaDireita ?? "",
              nivel: Math.max(0, Math.min(5, Number(ind.nivel ?? 0))),
              cor: normalizarCorIndicador(ind.cor, idx),
            }))
          : INDICADORES_PADRAO;

        return {
          atividadesAdaptadas: dados.atividades_adaptadas ?? 0,
          engajamento: dados.engajamento_percent ?? 0,
          peiGerado: dados.pei_gerado ? 1 : 0,
          resumo: dados.descricao_breve?.trim() || dados.perfil_ia?.trim() || "",
          engajamentoPorMateria: mapearEngajamento(dados.desempenho_por_area),
          peisPorDisciplina,
          metasDoBimestre,
          indicadoresDesenvolvimento,
        };
      }
      console.warn(
        `[getStudentInsights] Falha ao carregar dashboard do aluno ${numId} (HTTP ${resp?.status ?? "erro de rede/CORS"})`,
      );
    }
    return {
      atividadesAdaptadas: 0,
      engajamento: 0,
      peiGerado: 0,
      resumo: "",
      engajamentoPorMateria: ENGAJAMENTO_ZERADO,
      peisPorDisciplina: criarPeisDisciplinaNaoIniciada(),
      metasDoBimestre: METAS_BIMESTRE_PADRAO,
      indicadoresDesenvolvimento: INDICADORES_PADRAO,
    };
  },
};
