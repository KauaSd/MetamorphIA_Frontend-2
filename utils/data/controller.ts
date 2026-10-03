"use client";

import { repository } from "./dataRepository";
import type { AppData, Aluno, Turma, Conversa, Mensagem } from "./types";
import { dadosVazios } from "./types";
import { ALERTAS, type MensagemAlerta } from "../alertas";

export type Resultado = { ok: true; conversaId?: string } | { ok: false; erro: MensagemAlerta };

function gerarId(prefixo: string): string {
  const timestamp = Date.now().toString(36);
  const aleatorio = Math.random().toString(36).slice(2, 8);
  return `${prefixo}_${timestamp}${aleatorio}`;
}

function hojeDDMMYYYY(): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function agoraISO(): string {
  return new Date().toISOString();
}

export async function carregarDados(): Promise<AppData> {
  try {
    return await repository.carregarDados();
  } catch {
    return { ...dadosVazios };
  }
}

export async function salvarDados(dados: AppData): Promise<void> {
  await repository.salvarDados(dados);
}

export async function carregarProfessor(): Promise<string | null> {
  return repository.carregarProfessor();
}

export async function saveTeacherName(nome: string): Promise<Resultado> {
  const nomeTrim = nome.trim();
  if (nomeTrim.length === 0) {
    return { ok: false, erro: ALERTAS.DADOS_INVALIDOS };
  }
  await repository.salvarProfessor(nomeTrim);
  return { ok: true };
}

export async function createTurma(input: { nome: string }): Promise<Resultado> {
  const nomeTrim = input.nome.trim();
  if (nomeTrim.length === 0) {
    return { ok: false, erro: ALERTAS.TURMA_NOME_VAZIO };
  }
  const dados = await carregarDados();
  const novaTurma: Turma = {
    id: gerarId("tur"),
    nome: nomeTrim,
  };
  const novosDados: AppData = {
    ...dados,
    turmas: [...dados.turmas, novaTurma],
  };
  await salvarDados(novosDados);
  return { ok: true };
}

export async function updateTurma(id: string, input: { nome: string }): Promise<Resultado> {
  const nomeTrim = input.nome.trim();
  if (nomeTrim.length === 0) {
    return { ok: false, erro: ALERTAS.TURMA_NOME_VAZIO };
  }
  const dados = await carregarDados();
  const existe = dados.turmas.some((t) => t.id === id);
  if (!existe) {
    return { ok: false, erro: ALERTAS.TURMA_NAO_ENCONTRADA };
  }
  const turmasAtualizadas = dados.turmas.map((t) => (t.id === id ? { ...t, nome: nomeTrim } : t));
  await salvarDados({ ...dados, turmas: turmasAtualizadas });
  return { ok: true };
}

export async function deleteTurma(id: string): Promise<Resultado> {
  const dados = await carregarDados();
  const turmasAtualizadas = dados.turmas.filter((t) => t.id !== id);
  await salvarDados({ ...dados, turmas: turmasAtualizadas });
  return { ok: true };
}

export async function createAluno(input: {
  nome: string;
  idade: number | null;
  neurodivergencias: string[];
  turmaId: string | null;
}): Promise<Resultado> {
  const nomeTrim = input.nome.trim();
  if (nomeTrim.length === 0) {
    return { ok: false, erro: ALERTAS.ALUNO_NOME_VAZIO };
  }
  const dados = await carregarDados();
  const neuro = Array.isArray(input.neurodivergencias)
    ? input.neurodivergencias.filter((n) => typeof n === "string" && n.trim().length > 0)
    : [];
  const novoAluno: Aluno = {
    id: gerarId("alu"),
    nome: nomeTrim,
    idade: typeof input.idade === "number" && !Number.isNaN(input.idade) ? input.idade : null,
    neurodivergencias: neuro,
    turmaId: typeof input.turmaId === "string" ? input.turmaId : null,
  };
  const novosDados: AppData = {
    ...dados,
    alunos: [...dados.alunos, novoAluno],
  };
  await salvarDados(novosDados);
  return { ok: true };
}

export async function updateAluno(id: string, input: Partial<Aluno>): Promise<Resultado> {
  const dados = await carregarDados();
  const aluno = dados.alunos.find((a) => a.id === id);
  if (!aluno) {
    return { ok: false, erro: ALERTAS.ALUNO_NAO_ENCONTRADO };
  }
  const atualizado: Aluno = {
    ...aluno,
    ...input,
    id: aluno.id,
    nome: typeof input.nome === "string" && input.nome.trim().length > 0 ? input.nome.trim() : aluno.nome,
    neurodivergencias: Array.isArray(input.neurodivergencias)
      ? input.neurodivergencias.filter((n) => typeof n === "string" && n.trim().length > 0)
      : aluno.neurodivergencias,
    turmaId: input.turmaId === undefined ? aluno.turmaId : (typeof input.turmaId === "string" ? input.turmaId : null),
    idade: input.idade === undefined ? aluno.idade : (typeof input.idade === "number" && !Number.isNaN(input.idade) ? input.idade : null),
  };
  const alunosAtualizados = dados.alunos.map((a) => (a.id === id ? atualizado : a));
  await salvarDados({ ...dados, alunos: alunosAtualizados });
  return { ok: true };
}

export async function deleteAluno(id: string): Promise<Resultado> {
  const dados = await carregarDados();
  const alunosAtualizados = dados.alunos.filter((a) => a.id !== id);
  await salvarDados({ ...dados, alunos: alunosAtualizados });
  return { ok: true };
}

export async function openChatWith(alunoId: string): Promise<Resultado> {
  const dados = await carregarDados();
  const existente = dados.conversas.find((c) => c.alunoId === alunoId);
  if (existente) {
    return { ok: true, conversaId: existente.id };
  }
  const aluno = dados.alunos.find((a) => a.id === alunoId);
  const titulo = aluno ? `Conversa com ${aluno.nome}` : "Nova conversa";
  const novaConversa: Conversa = {
    id: gerarId("con"),
    alunoId,
    titulo,
    data: hojeDDMMYYYY(),
    mensagens: [],
  };
  const novosDados: AppData = {
    ...dados,
    conversas: [...dados.conversas, novaConversa],
  };
  await salvarDados(novosDados);
  return { ok: true, conversaId: novaConversa.id };
}

export async function addMessage(conversaId: string, texto: string, autor: "professor" | "aluno"): Promise<Resultado> {
  const textoTrim = texto.trim();
  if (textoTrim.length === 0) {
    return { ok: false, erro: ALERTAS.TEXTO_VAZIO };
  }
  const dados = await carregarDados();
  const conversa = dados.conversas.find((c) => c.id === conversaId);
  if (!conversa) {
    return { ok: false, erro: ALERTAS.CONVERSA_NAO_ENCONTRADA };
  }
  const novaMensagem: Mensagem = {
    id: gerarId("msg"),
    autor,
    texto: textoTrim,
    dataHora: agoraISO(),
  };
  const conversasAtualizadas = dados.conversas.map((c) =>
    c.id === conversaId
      ? {
          ...c,
          mensagens: [...c.mensagens, novaMensagem],
        }
      : c
  );
  await salvarDados({ ...dados, conversas: conversasAtualizadas });
  return { ok: true };
}
