// tons possiveis de um alerta, tambem usados pelo componente Alert
export type TomAlerta = "danger" | "warning" | "success" | "info";

// formato de uma mensagem de alerta
export interface MensagemAlerta {
  tom: TomAlerta;
  titulo: string;
  descricao?: string;
  itens?: string[];
}

// catalogo de mensagens, consumido pelos formularios de auth e pelo chat
export const ALERTAS = {
  LOGIN_SEM_IDENTIFICADOR: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone ou e-mail para entrar.",
  },
  LOGIN_SEM_SENHA: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite sua senha para entrar.",
  },
  LOGIN_INVALIDO: {
    tom: "danger",
    titulo: "E-mail ou telefone inválido",
    descricao: "Verifique os dados e tente novamente.",
  },
  CAD_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu nome completo.",
  },
  CAD_CONTATO_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone ou e-mail.",
  },
  CAD_TEL_INVALIDO: {
    tom: "danger",
    titulo: "Telefone inválido",
    descricao: "Verifique o número e tente novamente.",
  },
  CAD_EMAIL_INVALIDO: {
    tom: "danger",
    titulo: "E-mail inválido",
    descricao: "Verifique o e-mail e tente novamente.",
  },
  CAD_SENHA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite sua senha.",
  },
  CAD_TERMOS: {
    tom: "danger",
    titulo: "Aceite os termos",
    descricao: "É necessário aceitar os termos para continuar.",
  },
  RECUPERA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu e-mail ou telefone.",
  },
  RECUPERA_INVALIDO: {
    tom: "danger",
    titulo: "E-mail ou telefone inválido",
    descricao: "Verifique os dados e tente novamente.",
  },
  TOKEN_INCOMPLETO: {
    tom: "danger",
    titulo: "Código incompleto",
    descricao: "Digite os 6 dígitos do código.",
  },
  IDENTIFICACAO_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu nome para o sistema saber como chamar você.",
  },
  TURMA_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite o nome da turma.",
  },
  TURMA_NAO_ENCONTRADA: {
    tom: "danger",
    titulo: "Turma não encontrada",
    descricao: "Essa turma não existe mais. Volte para a lista de turmas.",
  },
  ALUNO_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite o nome do aluno.",
  },
  ALUNO_SEM_TURMA: {
    tom: "danger",
    titulo: "Escolha a turma",
    descricao: "Selecione a turma em que o aluno vai ficar.",
  },
  ALUNO_IDADE_INVALIDA: {
    tom: "danger",
    titulo: "Idade inválida",
    descricao: "A idade não pode ser negativa.",
  },
  ALUNO_SEM_TURMA_NAO_ENCONTRADA: {
    tom: "danger",
    titulo: "Turma não encontrada",
    descricao: "A turma escolhida não existe mais. Crie a turma antes de cadastrar o aluno.",
  },
  ALUNO_NAO_ENCONTRADO: {
    tom: "danger",
    titulo: "Aluno não encontrado",
    descricao: "Esse aluno não existe mais. Volte para a lista de alunos.",
  },
  CONVERSA_NAO_ENCONTRADA: {
    tom: "danger",
    titulo: "Conversa não encontrada",
    descricao: "Essa conversa não existe mais.",
  },
  MENSAGEM_VAZIA: {
    tom: "danger",
    titulo: "Mensagem vazia",
    descricao: "Digite uma mensagem antes de enviar.",
  },
  ERRO_GERAL: {
    tom: "danger",
    titulo: "Algo deu errado",
  },
  ERRO_CONEXAO: {
    tom: "danger",
    titulo: "Não foi possível concluir",
    descricao: "Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.",
  },
  CHAT_IA_FALHOU: {
    tom: "info",
    titulo: "Sem resposta da IA",
    descricao: "Não foi possível obter uma resposta agora. Tente enviar a mensagem de novo.",
  },
  SUCESSO_CADASTRO: {
    tom: "success",
    titulo: "Cadastro realizado",
    descricao: "Sua conta foi criada. Agora é só entrar.",
  },
} as const;
