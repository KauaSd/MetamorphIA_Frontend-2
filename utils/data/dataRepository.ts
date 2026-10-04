import type { Aluno, ClassInsights, Conversa, StudentInsights, Turma } from "./types";

export interface DataRepository {
  // turmas
  listTurmas(): Promise<Turma[]>;
  createTurma(input: { nome: string }): Promise<Turma>;
  updateTurma(id: string, input: { nome: string }): Promise<Turma>;
  deleteTurma(id: string): Promise<void>;

  // alunos
  listAlunos(): Promise<Aluno[]>;
  createAluno(input: {
    nome: string;
    idade: number | null;
    neuro: string[];
    turmaId: string;
  }): Promise<Aluno>;
  updateAluno(id: string, input: Partial<Aluno>): Promise<Aluno>;
  deleteAluno(id: string): Promise<void>;

  // conversas
  listConversas(): Promise<Conversa[]>;
  upsertConversa(conversa: Conversa): Promise<Conversa>;
  deleteConversa(id: string): Promise<void>;

  // identificacao
  getTeacherName(): Promise<string | null>;
  saveTeacherName(nome: string): Promise<void>;

  // leituras mockadas: nao persistem nada, viram fetch quando a API existir
  getClassInsights(turmaId: string): Promise<ClassInsights>;
  getStudentInsights(alunoId: string): Promise<StudentInsights>;
}

import { localStorageRepository } from "./localStorageRepository";

export const repository: DataRepository = localStorageRepository;

// vira esta linha quando o backend existir:
// import { httpRepository } from "./httpRepository";
// export const repository: DataRepository = httpRepository;
