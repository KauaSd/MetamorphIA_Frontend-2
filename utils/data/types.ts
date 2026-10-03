export type Identificador = string;

export type Turma = {
  id: Identificador;
  nome: string;
};

export type Neurodivergencia = string;

export type Aluno = {
  id: Identificador;
  nome: string;
  idade: number | null;
  neurodivergencias: Neurodivergencia[];
  turmaId: Identificador | null;
};

export type AutorMensagem = "professor" | "aluno";

export type Mensagem = {
  id: Identificador;
  autor: AutorMensagem;
  texto: string;
  dataHora: string; // ISO 8601 para facilitar ordenação interna
};

export type Conversa = {
  id: Identificador;
  alunoId: Identificador;
  titulo: string;
  data: string; // DD/MM/YYYY, compatível com formatarData
  mensagens: Mensagem[];
};

export type EngajamentoMateria = {
  materia: string;
  porcentagem: number; // 0-100
};

export type ClassInsights = {
  alunosCadastrados: number;
  neurodivergentes: number;
  percentualNeurodivergentes: number;
  atividadesAdaptadas: number;
  engajamento: number;
  engajamentoPorMateria: EngajamentoMateria[];
  resumo: string;
};

export type StudentInsights = {
  atividadesAdaptadas: number;
  engajamento: number;
  peiGerado: number;
  engajamentoPorMateria: EngajamentoMateria[];
  resumo: string;
};

export type AppData = {
  turmas: Turma[];
  alunos: Aluno[];
  conversas: Conversa[];
  teacherName: string | null;
};

export const dadosVazios: AppData = {
  turmas: [],
  alunos: [],
  conversas: [],
  teacherName: null,
};

export function alunosDaTurma(alunos: Aluno[], turmaId: Identificador): Aluno[] {
  return alunos.filter((aluno) => aluno.turmaId === turmaId);
}

export function turmaPorId(turmas: Turma[], id: Identificador): Turma | undefined {
  return turmas.find((turma) => turma.id === id);
}

export function alunoPorId(alunos: Aluno[], id: Identificador): Aluno | undefined {
  return alunos.find((aluno) => aluno.id === id);
}

export function turmaDoAluno(
  turmas: Turma[],
  alunos: Aluno[],
  alunoId: Identificador
): Turma | undefined {
  const aluno = alunoPorId(alunos, alunoId);
  if (!aluno || aluno.turmaId == null) return undefined;
  return turmaPorId(turmas, aluno.turmaId);
}

export function primeiraNeuro(aluno?: Aluno | null): string {
  if (!aluno || aluno.neurodivergencias.length === 0) return "—";
  return aluno.neurodivergencias[0];
}

export function neuroDaTurma(alunos: Aluno[]): Neurodivergencia[] {
  const set = new Set<Neurodivergencia>();
  for (const aluno of alunos) {
    for (const n of aluno.neurodivergencias) {
      set.add(n);
    }
  }
  return Array.from(set);
}

export function alunosComNeuro(alunos: Aluno[]): Aluno[] {
  return alunos.filter((aluno) => aluno.neurodivergencias.length > 0);
}

export function conversaDoAluno(conversas: Conversa[], alunoId: Identificador): Conversa | undefined {
  return conversas.find((conversa) => conversa.alunoId === alunoId);
}
