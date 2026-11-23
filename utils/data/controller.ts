import { ALERTAS, type MensagemAlerta } from "@/utils/alertas";
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

function falhaApi(err: unknown, titulo = "Erro ao comunicar com o servidor"): Resultado {
  const descricao =
    err instanceof Error && err.message
      ? err.message
      : "Verifique se a API está em execução e tente novamente.";
  return falha({ tom: "danger", titulo, descricao });
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
    const escolas = await repository.listEscolas();
    if (!escolas.some((e) => e.id === id)) return falha(ALERTAS.ESCOLA_NAO_ENCONTRADA);

    await repository.updateEscola(id, { nome: limpo });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível editar a escola");
  }
}

export async function deleteEscola(id: string): Promise<Resultado> {
  try {
    const escolas = await repository.listEscolas();
    if (!escolas.some((e) => e.id === id)) return falha(ALERTAS.ESCOLA_NAO_ENCONTRADA);

    await repository.deleteEscola(id);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível excluir a escola");
  }
}

export async function createTurma(dados?: { nome: string; escolaId?: string | null } | string): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const escolaId = typeof dados === "object" && dados.escolaId ? dados.escolaId : undefined;
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.TURMA_NOME_VAZIO);

  try {
    await repository.createTurma({ nome: limpo, escolaId });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível criar a turma");
  }
}

export async function updateTurma(
  id: string,
  dados: { nome: string; escolaId?: string | null } | string,
): Promise<Resultado> {
  const nome = typeof dados === "string" ? dados : dados?.nome ?? "";
  const temEscolaId = typeof dados === "object" && "escolaId" in dados;
  const escolaId = typeof dados === "object" && dados.escolaId ? dados.escolaId : undefined;
  const limpo = nome.trim();
  if (!limpo) return falha(ALERTAS.TURMA_NOME_VAZIO);

  try {
    const turmas = await repository.listTurmas();
    if (!turmas.some((turma) => turma.id === id)) return falha(ALERTAS.TURMA_NAO_ENCONTRADA);

    await repository.updateTurma(id, {
      nome: limpo,
      ...(temEscolaId ? { escolaId } : {}),
    });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível editar a turma");
  }
}

export async function deleteTurma(id: string): Promise<Resultado> {
  try {
    const turmas = await repository.listTurmas();
    if (!turmas.some((turma) => turma.id === id)) return falha(ALERTAS.TURMA_NAO_ENCONTRADA);

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

  if (input.idade !== null && input.idade < 0) {
    return falha(ALERTAS.ALUNO_IDADE_INVALIDA);
  }

  try {
    const turmas = await repository.listTurmas();
    if (!turmas.some((turma) => turma.id === turmaId)) {
      return falha(ALERTAS.ALUNO_SEM_TURMA_NAO_ENCONTRADA);
    }

    await repository.createAluno({ nome, idade: input.idade, neuro: input.neuro ?? [], turmaId });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível cadastrar o aluno");
  }
}

export async function updateAluno(id: string, dados: Partial<Aluno>): Promise<Resultado> {
  try {
    const alunos = await repository.listAlunos();
    const existente = alunos.find((aluno) => aluno.id === id);
    if (!existente) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);

    const nome = dados.nome === undefined ? existente.nome : dados.nome.trim();
    if (!nome) return falha(ALERTAS.ALUNO_NOME_VAZIO);

    if (dados.idade !== undefined && dados.idade !== null && dados.idade < 0) {
      return falha(ALERTAS.ALUNO_IDADE_INVALIDA);
    }

    if (dados.turmaId !== undefined) {
      const turmaId = dados.turmaId.trim();
      if (!turmaId) return falha(ALERTAS.ALUNO_SEM_TURMA);

      const turmas = await repository.listTurmas();
      if (!turmas.some((turma) => turma.id === turmaId)) {
        return falha(ALERTAS.ALUNO_SEM_TURMA_NAO_ENCONTRADA);
      }
      dados = { ...dados, turmaId };
    }

    await repository.updateAluno(id, { ...dados, nome });
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível atualizar o aluno");
  }
}

export async function deleteAluno(id: string): Promise<Resultado> {
  try {
    const alunos = await repository.listAlunos();
    if (!alunos.some((aluno) => aluno.id === id)) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);

    await repository.deleteAluno(id);
    return ok();
  } catch (err) {
    return falhaApi(err, "Não foi possível excluir o aluno");
  }
}

// a conversa nasce no clique, e nao na primeira mensagem, para o Recentes ja ter o que mostrar
export async function openChatWith(alunoId: string | null): Promise<Resultado> {
  if (!alunoId) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);
  const alunos = await repository.listAlunos();
  if (!alunos.some((aluno) => aluno.id === alunoId)) return falha(ALERTAS.ALUNO_NAO_ENCONTRADO);

  const conversas = await repository.listConversas();
  const existente = conversaDoAluno(conversas, alunoId);

  if (existente) return { ok: true, conversaId: existente.id };

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

  // a primeira mensagem do professor da titulo a conversa, o que da nome ao item no Recentes
  const titulo =
    autor === "professor" && conversa.mensagens.length === 0 ? textoFinal : conversa.titulo;

  await repository.upsertConversa({
    ...conversa,
    titulo,
    data: hojeDDMMAAAA(),
    mensagens: [...conversa.mensagens, mensagem],
  });

  return ok();
}

export async function carregarDados() {
  const [escolas, turmas, alunos, conversas, teacherName] = await Promise.all([
    repository.listEscolas(),
    repository.listTurmas(),
    repository.listAlunos(),
    repository.listConversas(),
    repository.getTeacherName(),
  ]);
  return { escolas, turmas, alunos, conversas, teacherName };
}
