import type {
  Aluno,
  ClassInsights,
  Conversa,
  Escola,
  Mensagem,
  StudentInsights,
  Turma,
} from "./types";

export interface DataRepository {
  // escolas
  listEscolas(signal?: AbortSignal): Promise<Escola[]>;
  createEscola(input: { nome: string }): Promise<Escola>;
  updateEscola(id: string, input: { nome: string }): Promise<Escola>;
  deleteEscola(id: string): Promise<void>;

  // turmas
  listTurmas(signal?: AbortSignal): Promise<Turma[]>;
  createTurma(input: {
    nome: string;
    escolaId?: string;
    serieAno?: string;
    letra?: string;
    horario?: string;
    disciplinas?: string[];
  }): Promise<Turma>;
  updateTurma(
    id: string,
    input: {
      nome: string;
      escolaId?: string;
      serieAno?: string;
      letra?: string;
      horario?: string;
      disciplinas?: string[];
    },
  ): Promise<Turma>;
  deleteTurma(id: string): Promise<void>;

  // alunos
  listAlunos(signal?: AbortSignal): Promise<Aluno[]>;
  createAluno(input: {
    nome: string;
    idade: number | null;
    neuro: string[];
    turmaId: string;
  }): Promise<Aluno>;
  updateAluno(id: string, input: Partial<Aluno>): Promise<Aluno>;
  deleteAluno(id: string): Promise<void>;

  // conversas
  listConversas(alunosJaCarregados?: Aluno[], signal?: AbortSignal): Promise<Conversa[]>;
  getConversaMensagens(alunoId: string, conversaId: string, signal?: AbortSignal): Promise<Mensagem[]>;
  upsertConversa(conversa: Conversa): Promise<Conversa>;
  deleteConversa(id: string): Promise<void>;

  // identificacao e onboarding
  getTeacherName(signal?: AbortSignal): Promise<string | null>;
  saveTeacherName(nome: string): Promise<void>;
  saveFullName(nomeReal: string): Promise<void>;
  saveProfessorPerfil(nomeReal: string, tags: string[]): Promise<void>;
  getOnboardingStatus(): Promise<{
    perfilProfessorFeito: boolean;
    identificacaoFeita: boolean;
    tutorialVisto: boolean;
    tutorialInstitucionalVisto: boolean;
    escolaInstitucional: boolean;
    plano: string | null;
  }>;
  markTutorialSeen(variante?: "padrao" | "institucional"): Promise<void>;

  // leituras mockadas: nao persistem nada, viram fetch quando a API existir
  getClassInsights(turmaId: string, signal?: AbortSignal): Promise<ClassInsights>;
  getStudentInsights(alunoId: string, signal?: AbortSignal): Promise<StudentInsights>;
}

import { apiRepository } from "./apiRepository";

export const repository: DataRepository = apiRepository;
