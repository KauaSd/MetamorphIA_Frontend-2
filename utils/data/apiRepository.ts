import {
  apiAiGatewayOrDirect,
  apiDbFetch,
  getAuthToken,
  getSavedUserProfile,
  parseNumeroId,
  setSavedUserProfile,
} from "@/utils/apiClient";
import type { DataRepository } from "./dataRepository";
import {
  hojeDDMMAAAA,
  type Aluno,
  type ClassInsights,
  type Conversa,
  type EngajamentoMateria,
  type Escola,
  type Mensagem,
  type StudentInsights,
  type Turma,
} from "./types";

const ENGAJAMENTO_ZERADO: EngajamentoMateria[] = [
  { rotulo: "Leitura e Escrita", materia: "leitura", percentual: 0 },
  { rotulo: "Matemática", materia: "matematica", percentual: 0 },
  { rotulo: "Ciências", materia: "ciencias", percentual: 0 },
];

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

async function extrairErroApi(resp: Response, fallback: string): Promise<string> {
  try {
    const json = (await resp.json()) as {
      detail?: string | Array<{ msg?: string }>;
    };
    if (typeof json.detail === "string" && json.detail.trim()) {
      return json.detail;
    }
    if (Array.isArray(json.detail) && json.detail.length > 0) {
      return json.detail.map((d) => d.msg || "Erro de validação").join("; ");
    }
  } catch {}
  return `${fallback} (HTTP ${resp.status})`;
}

function exigirToken(): void {
  if (!getAuthToken()) {
    throw new Error("Sessão não autenticada. Faça login novamente.");
  }
}

export const apiRepository: DataRepository = {
  async listEscolas(): Promise<Escola[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/escolas");
    if (!resp.ok) return [];
    const dados = (await resp.json()) as Array<{
      id_escola: number;
      nome_escola: string;
    }>;
    if (!Array.isArray(dados)) return [];
    return dados.map((e) => ({
      id: String(e.id_escola),
      nome: e.nome_escola,
    }));
  },

  async createEscola(input): Promise<Escola> {
    exigirToken();
    const resp = await apiDbFetch("/escolas", {
      method: "POST",
      body: JSON.stringify({ nome_escola: input.nome }),
    });
    if (!resp.ok) {
      throw new Error(await extrairErroApi(resp, "Não foi possível criar a escola"));
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
      throw new Error(await extrairErroApi(resp, "Não foi possível atualizar a escola"));
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
      throw new Error(await extrairErroApi(resp, "Não foi possível excluir a escola"));
    }
  },

  async listTurmas(): Promise<Turma[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/turma");
    if (!resp.ok) return [];
    const dados = (await resp.json()) as Array<{
      id_turma: number;
      nome_turma: string;
      id_escola?: number | null;
    }>;
    if (!Array.isArray(dados)) return [];
    return dados.map((t) => ({
      id: String(t.id_turma),
      nome: t.nome_turma,
      ...(t.id_escola ? { escolaId: String(t.id_escola) } : {}),
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
      }),
    });
    if (!resp.ok) {
      throw new Error(await extrairErroApi(resp, "Não foi possível criar a turma"));
    }
    const criado = (await resp.json()) as {
      id_turma: number;
      nome_turma: string;
      id_escola?: number;
    };
    return {
      id: String(criado.id_turma),
      nome: criado.nome_turma ?? input.nome,
      ...(criado.id_escola
        ? { escolaId: String(criado.id_escola) }
        : input.escolaId
          ? { escolaId: input.escolaId }
          : {}),
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
      }),
    });
    if (!resp.ok) {
      throw new Error(await extrairErroApi(resp, "Não foi possível atualizar a turma"));
    }
    const atualizado = (await resp.json()) as {
      id_turma: number;
      nome_turma: string;
      id_escola?: number;
    };
    return {
      id: String(atualizado.id_turma ?? numId),
      nome: atualizado.nome_turma ?? input.nome,
      ...(atualizado.id_escola ? { escolaId: String(atualizado.id_escola) } : {}),
    };
  },

  async deleteTurma(id): Promise<void> {
    exigirToken();
    const numId = parseNumeroId(id);
    if (numId === null) throw new Error("ID da turma inválido.");
    const resp = await apiDbFetch(`/turma/${numId}`, { method: "DELETE" });
    if (!resp.ok) {
      throw new Error(await extrairErroApi(resp, "Não foi possível excluir a turma"));
    }
  },

  async listAlunos(): Promise<Aluno[]> {
    if (!getAuthToken()) return [];
    const resp = await apiDbFetch("/Alunos");
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
      throw new Error(await extrairErroApi(resp, "Não foi possível cadastrar o aluno"));
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
      throw new Error(await extrairErroApi(resp, "Não foi possível atualizar o aluno"));
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
      throw new Error(await extrairErroApi(resp, "Não foi possível excluir o aluno"));
    }
  },

  async listConversas(): Promise<Conversa[]> {
    if (!getAuthToken()) return [];

    const alunos = await this.listAlunos();
    const porId = new Map<string, Conversa>();
    for (const [cid, conv] of conversasEmMemoria.entries()) {
      porId.set(cid, conv);
    }

    await Promise.all(
      alunos.map(async (aluno) => {
        const numAluno = parseNumeroId(aluno.id);
        if (numAluno === null) return;
        try {
          const resp = await apiAiGatewayOrDirect(
            `/AI/chat/aluno/${numAluno}/conversas`,
            `/alunos/${numAluno}/conversas`,
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
            let mensagens: Mensagem[] = [];

            try {
              const respDet = await apiAiGatewayOrDirect(
                `/AI/chat/aluno/${numAluno}/conversas/${cid}`,
                `/alunos/${numAluno}/conversas/${cid}`,
              );
              if (respDet.ok) {
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
                mensagens = (det.mensagens ?? []).map((m, idx) => ({
                  id: `${cid}_m_${idx}`,
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
              }
            } catch {}

            const conversaApi: Conversa = {
              id: cid,
              alunoId: aluno.id,
              titulo: resumo.titulo || "Nova conversa",
              data: formatarIsoParaDDMMAAAA(resumo.data),
              mensagens,
            };
            conversasEmMemoria.delete(cid);
            porId.set(cid, conversaApi);
          }
        } catch {}
      }),
    );

    return Array.from(porId.values());
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
          throw new Error(await extrairErroApi(resp, "Não foi possível excluir a conversa"));
        }
      }
    }
  },

  async getTeacherName(): Promise<string | null> {
    if (!getAuthToken()) return null;
    try {
      const resp = await apiDbFetch("/autenticar/me");
      if (resp.ok) {
        const perfil = (await resp.json()) as {
          id_usuario: number;
          nome_usuario: string;
          email_usuario?: string;
          telefone_usuario?: string;
          tipo_usuario?: string;
          plano?: string;
          id_grupo?: number;
          pode_chat?: boolean;
          tags?: string[];
        };
        setSavedUserProfile(perfil);
        return perfil.nome_usuario || null;
      }
    } catch {}
    return getSavedUserProfile()?.nome_usuario ?? null;
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
        emailprof: perfil?.email_usuario ?? null,
        numprof: perfil?.telefone_usuario ?? null,
        tags: perfil?.tags ?? [],
      }),
    });
    if (!resp.ok) {
      throw new Error(await extrairErroApi(resp, "Não foi possível atualizar o perfil"));
    }
    if (perfil) {
      setSavedUserProfile({ ...perfil, nome_usuario: nome });
    }
  },

  async getClassInsights(turmaId: string): Promise<ClassInsights> {
    const numId = parseNumeroId(turmaId);
    if (numId !== null && getAuthToken()) {
      const resp = await apiAiGatewayOrDirect(
        `/AI/dashboard/turma/${numId}`,
        `/turmas/${numId}/dashboard`,
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

  async getStudentInsights(alunoId: string): Promise<StudentInsights> {
    const numId = parseNumeroId(alunoId);
    if (numId !== null && getAuthToken()) {
      const resp = await apiAiGatewayOrDirect(
        `/AI/dashboard/aluno/${numId}`,
        `/alunos/${numId}/dashboard`,
      );
      if (resp.ok) {
        const dados = (await resp.json()) as {
          atividades_adaptadas?: number;
          engajamento_percent?: number;
          pei_gerado?: boolean;
          perfil_ia?: string | null;
          desempenho_por_area?: Record<string, number>;
        };
        return {
          atividadesAdaptadas: dados.atividades_adaptadas ?? 0,
          engajamento: dados.engajamento_percent ?? 0,
          peiGerado: dados.pei_gerado ? 1 : 0,
          resumo: dados.perfil_ia ?? "",
          engajamentoPorMateria: mapearEngajamento(dados.desempenho_por_area),
        };
      }
    }
    return {
      atividadesAdaptadas: 0,
      engajamento: 0,
      peiGerado: 0,
      resumo: "",
      engajamentoPorMateria: ENGAJAMENTO_ZERADO,
    };
  },
};
