// ---------- entidades de dominio ----------

export interface Turma {
  id: string;
  nome: string;
}

export interface Aluno {
  id: string;
  nome: string;
  idade: number | null;
  neuro: string[];
  turmaId: string;
}

export interface Mensagem {
  id: string;
  texto: string;
  autor: "professor" | "aluno";
  em: string;
}

export interface Conversa {
  id: string;
  alunoId: string;
  titulo: string;
  // DD/MM/YYYY, o formato que utils/datas.ts formata
  data: string;
  mensagens: Mensagem[];
}

// teacherName e a unica chave em ingles: e identidade do usuario logado, nao entidade de dominio
export interface AppData {
  teacherName: string | null;
  turmas: Turma[];
  alunos: Aluno[];
  conversas: Conversa[];
}

// ---------- leituras mockadas, sem fonte de dado no app por enquanto ----------

export type Materia = "leitura" | "matematica" | "ciencias";

export interface EngajamentoMateria {
  rotulo: string;
  materia: Materia;
  percentual: number;
}

export interface ClassInsights {
  alunosComPeiAtivo: number;
  adaptacoesFeitas: number;
  resumo: string;
  engajamento: EngajamentoMateria[];
}

export interface StudentInsights {
  atividadesAdaptadas: number;
  engajamento: number;
  peiGerado: number;
  resumo: string;
  engajamentoPorMateria: EngajamentoMateria[];
}

// ---------- armazenamento ----------

export const STORAGE_KEY = "metamorphia:dados:v1";

export function dadosVazios(): AppData {
  return { teacherName: null, turmas: [], alunos: [], conversas: [] };
}

// ---------- ids ----------

export function gerarId(prefixo: "tur" | "alu" | "con" | "msg"): string {
  const tempo = Date.now().toString(36);
  const sorteio = Math.random().toString(36).slice(2, 8);
  return `${prefixo}_${tempo}${sorteio}`;
}

// ---------- seletores ----------

export function alunosDaTurma(alunos: Aluno[], turmaId: string): Aluno[] {
  return alunos.filter((aluno) => aluno.turmaId === turmaId);
}

export function turmaPorId(turmas: Turma[], id: string): Turma | undefined {
  return turmas.find((turma) => turma.id === id);
}

export function alunoPorId(alunos: Aluno[], id: string): Aluno | undefined {
  return alunos.find((aluno) => aluno.id === id);
}

export function turmaDoAluno(turmas: Turma[], alunos: Aluno[], alunoId: string): Turma | undefined {
  const aluno = alunoPorId(alunos, alunoId);
  if (!aluno) return undefined;
  return turmaPorId(turmas, aluno.turmaId);
}

export function conversaDoAluno(conversas: Conversa[], alunoId: string): Conversa | undefined {
  return conversas.find((conversa) => conversa.alunoId === alunoId);
}

/** "DD/MM/AAAA" vira um numero ordenavel, porque a data e texto no store */
function dataOrdenavel(data: string): number {
  const [dia, mes, ano] = data.split("/").map(Number);
  if ([dia, mes, ano].some((parte) => Number.isNaN(parte))) return 0;
  return ano * 10000 + mes * 100 + dia;
}

/**
 * Todas as conversas de um aluno, da mais recente para a mais antiga.
 *
 * A ordenacao precisa converter a data: como `data` e "DD/MM/AAAA", ordenar
 * pelo texto colocaria "08/05/2026" depois de "15/05/2026".
 */
export function conversasDoAluno(conversas: Conversa[], alunoId: string): Conversa[] {
  return conversas
    .filter((conversa) => conversa.alunoId === alunoId)
    .sort((a, b) => dataOrdenavel(b.data) - dataOrdenavel(a.data));
}

export function primeiraNeuro(aluno: Aluno | null | undefined): string {
  return aluno?.neuro[0] ?? "Outro";
}

export function contarNeurodivergentes(alunos: Aluno[]): number {
  return alunos.filter((aluno) => aluno.neuro.length > 0).length;
}

// turma sem alunos precisa devolver 0 e nunca NaN, senao o card imprime "NaN% da turma"
export function percentualNeurodivergentes(alunos: Aluno[]): number {
  if (alunos.length === 0) return 0;
  return Math.round((contarNeurodivergentes(alunos) / alunos.length) * 100);
}

// ---------- datas ----------

export function hojeDDMMAAAA(): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${agora.getFullYear()}`;
}
