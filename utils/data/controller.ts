import { ALERTAS, type MensagemAlerta } from "@/utils/alertas";
import { ApiError } from "./apiRepository";
import { repository } from "./dataRepository";
import { conversaDoAluno, gerarId, hojeDDMMAAAA } from "./types";
import type { Aluno, AnexoMensagem } from "./types";

export type Resultado =
  | { ok: true; conversaId?: string }
  | { ok: false; erro: MensagemAlerta };

function ok(): Resultado {
  return { ok: true };
}

function falha(erro: MensagemAlerta): Resultado {
  return { ok: false, erro };
}

const CODIGOS_LIMITE_ALERTA = {
  LIMITE_ESCOLAS_ATINGIDO: ALERTAS.LIMITE_ESCOLAS_ATINGIDO,
  PLANO_PRO_NAO_CONTRATADO: ALERTAS.PLANO_PRO_NAO_CONTRATADO,
  LIMITE_TURMAS_ATINGIDO: ALERTAS.LIMITE_TURMAS_ATINGIDO,
  LIMITE_ALUNOS_ATINGIDO: ALERTAS.LIMITE_ALUNOS_ATINGIDO,
} as const;

const TIPO_LIMITE_ALERTA = {
  escola: ALERTAS.LIMITE_ESCOLAS_ATINGIDO,
  turma: ALERTAS.LIMITE_TURMAS_ATINGIDO,
  aluno: ALERTAS.LIMITE_ALUNOS_ATINGIDO,
} as const;

function falhaApi(err: unknown, titulo = "Erro ao comunicar com o servidor"): Resultado {
  if (err instanceof ApiError) {
    const alertaPorCodigo = err.codigoErro
      ? CODIGOS_LIMITE_ALERTA[err.codigoErro as keyof typeof CODIGOS_LIMITE_ALERTA]
      : undefined;
    const alertaPorTipo =
      !alertaPorCodigo && err.status === 403 && err.tipoLimite
        ? TIPO_LIMITE_ALERTA[err.tipoLimite as keyof typeof TIPO_LIMITE_ALERTA]
        : undefined;
    const alertaLimite = alertaPorCodigo ?? alertaPorTipo;

    if (alertaLimite) {
      const temMensagemApi = err.message && !err.message.includes(`(HTTP ${err.status})`);
      return falha({
        ...alertaLimite,
        descricao: temMensagemApi ? err.message : alertaLimite.descricao,
      });
    }
  }

  const descricao =
    err instanceof Error && err.message
      ? err.message
      : "Verifique se a API está em execução e tente novamente.";
  return falha({ tom: "danger", titulo, descricao });
}

export async function saveProfessorPerfil(nomeReal: string, tags: string[]): Promise<Resultado> {
  const limpo = nomeReal.trim();
  if (!limpo) return falha(ALERTAS.IDENTIFICACAO_NOME_VAZIO);

  try {
    await repository.saveProfessorPerfil(limpo, tags);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível salvar seus dados");
  }
}

export async function saveTeacherName(nome: string): Promise<Resultado> {
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.IDENTIFICACAO_NOME_VAZIO);

  try {
    await repository.saveTeacherName(limpo);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível salvar seu nome");
  }
}

export async function createEscola(dados?: { nome: string } | string): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.ESCOLA_NOME_VAZIO);

  try {
    await repository.createEscola({ nome: limpo });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível criar a escola");
  }
}

export async function updateEscola(id: string, dados: { nome: string } | string): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.ESCOLA_NOME_VAZIO);

  try {
    await repository.updateEscola(id, { nome: limpo });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível editar a escola");
  }
}

export async function deleteEscola(id: string): Promise<Resultado> {
  try {
    await repository.deleteEscola(id);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível excluir a escola");
  }
}

export async function createTurma(
  dados?:
    | {
        nome: string;
        escolaId?: string | null;
        serieAno?: string;
        letra?: string;
        horario?: string;
      }
    | string,
): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const escolaId = typeof dados === "object" && dados.escolaId ? dados.escolaId : undefined;
  const serieAno = typeof dados === "object" ? dados?.serieAno : undefined;
  const letra = typeof dados === "object" ? dados?.letra : undefined;
  const horario = typeof dados === "object" ? dados?.horario : undefined;
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.TURMA_NOME_VAZIO);

  try {
    await repository.createTurma({
      nome: limpo,
      escolaId,
      serieAno,
      letra,
      horario,
    });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível criar a turma");
  }
}

export async function updateTurma(
  id: string,
  dados:
    | {
        nome: string;
        escolaId?: string | null;
        serieAno?: string;
        letra?: string;
        horario?: string;
      }
    | string,
): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const temEscolaId = typeof dados === "object" && "escolaId" in dados;
  const escolaId = typeof dados === "object" && dados.escolaId ? dados.escolaId : undefined;
  const serieAno = typeof dados === "object" ? dados?.serieAno : undefined;
  const letra = typeof dados === "object" ? dados?.letra : undefined;
  const horario = typeof dados === "object" ? dados?.horario : undefined;
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.TURMA_NOME_VAZIO);

  try {
    await repository.updateTurma(id, {
      nome: limpo,
      ...(temEscolaId ? { escolaId } : {}),
      ...(serieAno !== undefined ? { serieAno } : {}),
      ...(letra !== undefined ? { letra } : {}),
      ...(horario !== undefined ? { horario } : {}),
    });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível editar a turma");
  }
}

export async function deleteTurma(id: string): Promise<Resultado> {
  try {
    await repository.deleteTurma(id);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível excluir a turma");
  }
}

export async function createAluno(input: {
  nome: string;
  idade: number | null;
  neuro?: string[];
  turmaId: string;
}): Promise<Resultado> {
  const nome = input.nome.trim();
  if (!nome) return falha(ALERTAS.ALUNO_NOME_VAZIO);

  // todo aluno pertence a uma turma: e assim que a lista de cada turma e montada
  const turmaId = input.turmaId.trim();
  if (!turmaId) return falha(ALERTAS.ALUNO_SEM_TURMA);

  const neuro = (input.neuro ?? []).map((n) => n.trim()).filter(Boolean);
  if (neuro.length === 0) return falha(ALERTAS.ALUNO_SEM_NEURO);

  if (input.idade !== null && input.idade < 0) {
    return falha(ALERTAS.ALUNO_IDADE_INVALIDA);
  }

  try {
    await repository.createAluno({ nome, idade: input.idade, neuro, turmaId });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível cadastrar o aluno");
  }
}

export async function updateAluno(id: string, dados: Partial<Aluno>): Promise<Resultado> {
  try {
    const nome = dados.nome !== undefined ? dados.nome.trim() : undefined;
    if (nome !== undefined && !nome) return falha(ALERTAS.ALUNO_NOME_VAZIO);

    if (dados.idade !== undefined && dados.idade !== null && dados.idade < 0) {
      return falha(ALERTAS.ALUNO_IDADE_INVALIDA);
    }

    if (dados.turmaId !== undefined) {
      const turmaId = dados.turmaId.trim();
      if (!turmaId) return falha(ALERTAS.ALUNO_SEM_TURMA);
      dados = { ...dados, turmaId };
    }

    await repository.updateAluno(id, nome !== undefined ? { ...dados, nome } : dados);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível atualizar o aluno");
  }
}

export async function deleteAluno(id: string): Promise<Resultado> {
  try {
    await repository.deleteAluno(id);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível excluir o aluno");
  }
}

// a conversa nasce no clique, e nao na primeira mensagem, para o Recentes ja ter o que mostrar
export async function openChatWith(
  alunoId: string | null,
  opcoes?: { nova?: boolean },
): Promise<Resultado> {
  if (!alunoId) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);
  const alunos = await repository.listAlunos();
  if (!alunos.some((aluno) => aluno.id === alunoId)) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);

  if (!opcoes?.nova) {
    const conversas = await repository.listConversas();
    const existente = conversaDoAluno(conversas, alunoId);
    if (existente) return { ok: true, conversaId: existente.id };
  }

  const conversa = {
    id: gerarId("con"),
    alunoId,
    titulo: "Nova conversa",
    data: hojeDDMMAAAA(),
    mensagens: [],
  };

  await repository.upsertConversa(conversa);
  return { ok: true, conversaId: conversa.id };
}

export async function addMessage(
  conversaId: string,
  texto: string,
  autor: "professor" | "aluno",
  anexos?: AnexoMensagem[],
  alunoIdFallback?: string,
  tituloOverride?: string,
): Promise<Resultado> {
  const limpo = texto.trim();
  const temAnexos = Boolean(anexos && anexos.length > 0);
  if (!limpo && !temAnexos) return falha(ALERTAS.MENSAGEM_VAZIA);

  const conversas = await repository.listConversas();
  let conversa = conversas.find((item) => item.id === conversaId);
  if (!conversa && alunoIdFallback) {
    conversa = {
      id: conversaId,
      alunoId: alunoIdFallback,
      titulo: limpo || (anexos?.[0]?.name ?? "Nova conversa"),
      data: hojeDDMMAAAA(),
      mensagens: [],
    };
  }
  if (!conversa) return falha(ALERTAS.CONVERSA_NAO_ENCONTRADA);

  const textoFinal = limpo || `📎 Arquivo enviado: ${anexos!.map((a) => a.name).join(", ")}`;

  const mensagem = {
    id: gerarId("msg"),
    texto: textoFinal,
    autor,
    em: new Date().toISOString(),
    ...(temAnexos ? { anexos } : {}),
  };

  // a primeira mensagem do professor (ou tituloOverride do PEI) da titulo a conversa no Recentes
  const titulo =
    tituloOverride?.trim() ||
    (autor === "professor" && conversa.mensagens.length === 0 ? textoFinal : conversa.titulo);

  await repository.upsertConversa({
    ...conversa,
    titulo,
    data: hojeDDMMAAAA(),
    mensagens: [...conversa.mensagens, mensagem],
  });

  return ok();
}

export async function markTutorialSeen(
  variante: "padrao" | "institucional" = "padrao",
): Promise<void> {
  await repository.markTutorialSeen(variante);
}

export async function alternarModo(): Promise<Resultado> {
  try {
    const { alternarModoConta } = await import("./apiRepository");
    await alternarModoConta();
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível alternar o modo da conta");
  }
}

export async function carregarDados() {
  const alunosPromise = repository.listAlunos();
  const [escolas, turmas, alunos, conversas, teacherName] = await Promise.all([
    repository.listEscolas(),
    repository.listTurmas(),
    alunosPromise,
    alunosPromise.then((lista) => repository.listConversas(lista)),
    repository.getTeacherName(),
  ]);
  const onboarding = await repository.getOnboardingStatus();
  return {
    escolas,
    turmas,
    alunos,
    conversas,
    teacherName,
    nomeReal: null as string | null,
    plano: onboarding.plano,
    escolaInstitucional: onboarding.escolaInstitucional,
    perfilProfessorFeito: onboarding.perfilProfessorFeito,
    identificacaoFeita: onboarding.identificacaoFeita,
    tutorialVisto: onboarding.tutorialVisto,
    tutorialInstitucionalVisto: onboarding.tutorialInstitucionalVisto,
  };
}
