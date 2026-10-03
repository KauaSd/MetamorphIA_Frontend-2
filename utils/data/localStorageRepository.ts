"use client";

import type {
  AppData,
  ClassInsights,
  Conversa,
  StudentInsights,
  Turma,
  Aluno,
} from "./types";
import { dadosVazios } from "./types";
import { STORAGE_KEY } from "./dataRepository";

type DadosPersistidos = AppData;

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

function sanitizarDados(brutos: Partial<DadosPersistidos> | null): AppData {
  if (!brutos || typeof brutos !== "object") {
    return { ...dadosVazios };
  }

  const turmas: Turma[] = Array.isArray(brutos.turmas)
    ? brutos.turmas
        .filter((t: any) => t && typeof t === "object")
        .map((t: any) => ({
          id: typeof t.id === "string" ? t.id : gerarId("tur"),
          nome: typeof t.nome === "string" ? t.nome : "",
        }))
    : [];

  const alunos: Aluno[] = Array.isArray(brutos.alunos)
    ? brutos.alunos
        .filter((a: any) => a && typeof a === "object")
        .map((a: any) => ({
          id: typeof a.id === "string" ? a.id : gerarId("alu"),
          nome: typeof a.nome === "string" ? a.nome : "",
          idade: typeof a.idade === "number" && !isNaN(a.idade) ? a.idade : null,
          neurodivergencias: Array.isArray(a.neurodivergencias)
            ? a.neurodivergencias.filter((n: any) => typeof n === "string" && n.trim().length > 0)
            : [],
          turmaId: typeof a.turmaId === "string" ? a.turmaId : null,
        }))
    : [];

  const conversas: Conversa[] = Array.isArray(brutos.conversas)
    ? brutos.conversas
        .filter((c: any) => c && typeof c === "object")
        .map((c: any) => ({
          id: typeof c.id === "string" ? c.id : gerarId("con"),
          alunoId: typeof c.alunoId === "string" ? c.alunoId : "",
          titulo: typeof c.titulo === "string" ? c.titulo : "Nova conversa",
          data: typeof c.data === "string" ? c.data : hojeDDMMYYYY(),
          mensagens: Array.isArray(c.mensagens)
            ? c.mensagens
                .filter((m: any) => m && typeof m === "object")
                .map((m: any) => ({
                  id: typeof m.id === "string" ? m.id : gerarId("msg"),
                  autor: m.autor === "professor" ? "professor" : "aluno",
                  texto: typeof m.texto === "string" ? m.texto : "",
                  dataHora: typeof m.dataHora === "string" ? m.dataHora : new Date().toISOString(),
                }))
            : [],
        }))
    : [];

  const teacherName =
    typeof brutos.teacherName === "string" && brutos.teacherName.trim().length > 0
      ? brutos.teacherName.trim()
      : null;

  return { turmas, alunos, conversas, teacherName };
}

export class LocalStorageRepository {
  private memoria: AppData | null = null;

  async carregarDados(): Promise<AppData> {
    if (typeof window === "undefined") {
      return { ...dadosVazios };
    }
    try {
      const bruto = window.localStorage.getItem(STORAGE_KEY);
      if (bruto == null) return { ...dadosVazios };
      const parseado = JSON.parse(bruto) as Partial<DadosPersistidos>;
      const limpo = sanitizarDados(parseado);
      this.memoria = limpo;
      return { ...limpo };
    } catch {
      return { ...dadosVazios };
    }
  }

  async salvarDados(dados: AppData): Promise<void> {
    const limpo = sanitizarDados(dados);
    this.memoria = limpo;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(limpo));
    }
  }

  async carregarProfessor(): Promise<string | null> {
    const dados = await this.carregarDados();
    return dados.teacherName;
  }

  async salvarProfessor(nome: string): Promise<void> {
    const dados = await this.carregarDados();
    const teacherName = nome.trim() || null;
    await this.salvarDados({ ...dados, teacherName });
  }

  async getClassInsights(): Promise<ClassInsights> {
    return {
      alunosCadastrados: 0,
      neurodivergentes: 0,
      percentualNeurodivergentes: 0,
      atividadesAdaptadas: 0,
      engajamento: 0,
      engajamentoPorMateria: [],
      resumo: "",
    };
  }

  async getStudentInsights(): Promise<StudentInsights> {
    return {
      atividadesAdaptadas: 0,
      engajamento: 0,
      peiGerado: 0,
      engajamentoPorMateria: [],
      resumo: "",
    };
  }
}

function criarRepositorioPadrao(): LocalStorageRepository {
  return new LocalStorageRepository();
}
