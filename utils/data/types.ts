// ---------- entidades de dominio ----------

export interface Escola {
  id: string;
  nome: string;
  plano?: string | null;
  institucional?: boolean;
  codigoConvite?: string | null;
  papel?: string | null;
}

export interface Turma {
  id: string;
  nome: string;
  escolaId?: string;
  serieAno?: string;
  letra?: string;
  horario?: string;
  disciplinas?: string[];
}

export interface Aluno {
  id: string;
  nome: string;
  idade: number | null;
  neuro: string[];
  turmaId: string;
  descricao?: string;
}

export interface AnexoMensagem {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export interface Mensagem {
  id: string;
  texto: string;
  autor: "professor" | "aluno";
  em: string;
  anexos?: AnexoMensagem[];
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
  nomeReal: string | null;
  diasParaTrocarNomeReal: number;
  tipoUsuario: string | null;
  modoAtivo: string | null;
  escolaAdmId: string | null;
  ehAdmin: boolean;
  ehAdminRede: boolean;
  podeAlternarModoProfessor: boolean;
  podeAcessarPainelAdm: boolean;
  podeGerenciarAlunos: boolean;
  podeGerenciarTurmas: boolean;
  podeCriarEscolas: boolean;
  podeChat: boolean;
  plano: string | null;
  escolaInstitucional: boolean;
  perfilProfessorFeito: boolean;
  identificacaoFeita: boolean;
  tutorialVisto: boolean;
  tutorialInstitucionalVisto: boolean;
  escolas: Escola[];
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

export type StatusPeiDisciplina = "concluido" | "em_andamento" | "nao_iniciado";

export interface PeiDisciplinaItem {
  id: string;
  disciplina: string;
  status: StatusPeiDisciplina;
}

export interface PeisPorDisciplinaResumo {
  statusGeral: string;
  concluidos: number;
  total: number;
  disciplinas: PeiDisciplinaItem[];
  ultimoEnvio?: string | null;
  proximoPeriodo?: string | null;
  atrasado?: boolean;
  todosConcluidos?: boolean;
  pendentes?: string[];
}

export type StatusMetaBimestre = "em_progresso" | "a_iniciar" | "atingida";

export interface MetaBimestreItem {
  id: string;
  titulo: string;
  status: StatusMetaBimestre;
}

export type CorIndicador = "warning" | "accent" | "info" | "success";

export interface IndicadorDesenvolvimento {
  id: string;
  titulo: string;
  escalaEsquerda: string;
  escalaCentro: string;
  escalaDireita: string;
  /** Nivel de 1 a 5 */
  nivel: number;
  cor: CorIndicador;
}

export interface StudentInsights {
  atividadesAdaptadas: number;
  engajamento: number;
  peiGerado: number;
  resumo: string;
  engajamentoPorMateria: EngajamentoMateria[];
  peisPorDisciplina: PeisPorDisciplinaResumo;
  metasDoBimestre: MetaBimestreItem[];
  indicadoresDesenvolvimento: IndicadorDesenvolvimento[];
}

// ---------- armazenamento ----------

export const STORAGE_KEY = "metamorphia:dados:v1";

export function dadosVazios(): AppData {
  return {
    teacherName: null,
    nomeReal: null,
    diasParaTrocarNomeReal: 0,
    tipoUsuario: null,
    modoAtivo: null,
    escolaAdmId: null,
    ehAdmin: false,
    ehAdminRede: false,
    podeAlternarModoProfessor: false,
    podeAcessarPainelAdm: false,
    podeGerenciarAlunos: true,
    podeGerenciarTurmas: true,
    podeCriarEscolas: true,
    podeChat: true,
    plano: null,
    escolaInstitucional: false,
    perfilProfessorFeito: false,
    identificacaoFeita: false,
    tutorialVisto: false,
    tutorialInstitucionalVisto: false,
    escolas: [],
    turmas: [],
    alunos: [],
    conversas: [],
  };
}

// ---------- ids ----------

export function gerarId(prefixo: "esc" | "tur" | "alu" | "con" | "msg"): string {
  const tempo = Date.now().toString(36);
  const sorteio = Math.random().toString(36).slice(2, 8);
  return `${prefixo}_${tempo}${sorteio}`;
}

// ---------- seletores ----------

export function turmasDaEscola(turmas: Turma[], escolaId: string): Turma[] {
  return turmas.filter((turma) => turma.escolaId === escolaId);
}

export function escolaPorId(escolas: Escola[], id: string): Escola | undefined {
  return escolas.find((escola) => escola.id === id);
}

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
  return conversasRecentes(conversas.filter((conversa) => conversa.alunoId === alunoId));
}

/** Conversas da mais recente para a mais antiga, sem mexer na lista original */
export function conversasRecentes(conversas: Conversa[]): Conversa[] {
  return conversas.toSorted((a, b) => dataOrdenavel(b.data) - dataOrdenavel(a.data));
}

export type ResolucaoChat =
  | { status: "sem-aluno" }
  | { status: "ok"; aluno: Aluno; conversa?: Conversa; precisaCriar: boolean };

/**
 * Regra do chat: ele so existe quando ha um aluno para conversar.
 *
 * - `conversaId` valido resolve o aluno pela conversa;
 * - `alunoId` valido ainda sem conversa pede a criacao da conversa;
 * - qualquer outro caso (parametro ausente, id inexistente, conversa
 *   orfa de um aluno removido) nao resolve aluno, e a tela sai da rota.
 */
export function resolverChat(
  conversas: Conversa[],
  alunos: Aluno[],
  params: { conversaId: string | null; alunoId: string | null },
): ResolucaoChat {
  const { conversaId, alunoId } = params;

  if (conversaId) {
    const conversa = conversas.find((item) => item.id === conversaId);
    const aluno = conversa ? alunoPorId(alunos, conversa.alunoId) : undefined;
    if (!conversa || !aluno) return { status: "sem-aluno" };
    return { status: "ok", aluno, conversa, precisaCriar: false };
  }

  if (alunoId) {
    const aluno = alunoPorId(alunos, alunoId);
    if (!aluno) return { status: "sem-aluno" };
    return { status: "ok", aluno, precisaCriar: true };
  }

  return { status: "sem-aluno" };
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
