import type { AppData, ClassInsights, StudentInsights } from "./types";
import { LocalStorageRepository } from "./localStorageRepository";

export interface DataRepository {
  carregarDados(): Promise<AppData>;
  salvarDados(dados: AppData): Promise<void>;

  carregarProfessor(): Promise<string | null>;
  salvarProfessor(nome: string): Promise<void>;

  getClassInsights(turmaId: string): Promise<ClassInsights>;
  getStudentInsights(alunoId: string): Promise<StudentInsights>;
}

export const STORAGE_KEY = "metamorphia:dados:v1";

function criarRepositorioPadrao(): DataRepository {
  return new LocalStorageRepository();
}

export const repository: DataRepository = criarRepositorioPadrao();
