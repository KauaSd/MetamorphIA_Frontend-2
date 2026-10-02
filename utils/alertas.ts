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
    titulo: "Não foi possível entrar",
    descricao: "Telefone, e-mail ou senha incorretos. Confira os dados e tente de novo.",
  },

  CAD_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu nome completo.",
  },
  CAD_TEL_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone.",
  },
  CAD_TEL_INVALIDO: {
    tom: "danger",
    titulo: "Telefone inválido",
    descricao: "Digite um telefone com DDD, com 10 ou 11 dígitos.",
  },
  CAD_EMAIL_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu e-mail.",
  },
  CAD_EMAIL_INVALIDO: {
    tom: "danger",
    titulo: "E-mail inválido",
    descricao: "Confira o e-mail digitado. O formato esperado é nome@dominio.com.",
  },
  CAD_SENHA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite uma senha.",
  },
  CAD_EMAIL_EM_USO: {
    tom: "danger",
    titulo: "E-mail já cadastrado",
    descricao: "Já existe uma conta com esse e-mail. Tente entrar ou recuperar a senha.",
  },
  CAD_TERMOS: {
    tom: "danger",
    titulo: "Aceite os termos para continuar",
    descricao:
      "Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar a conta.",
  },

  RECUPERA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone ou e-mail cadastrado.",
  },
  RECUPERA_INVALIDO: {
    tom: "danger",
    titulo: "Dado inválido",
    descricao: "Confira o dado digitado. Use um e-mail válido ou um telefone com DDD.",
  },

  TOKEN_INCOMPLETO: {
    tom: "danger",
    titulo: "Código incompleto",
    descricao: "Digite os 6 dígitos do código que enviamos para você.",
  },
  TOKEN_INVALIDO: {
    tom: "danger",
    titulo: "Código inválido",
    descricao: "O código digitado não confere. Confira os números e tente de novo.",
  },

  SUCESSO_CADASTRO: {
    tom: "success",
    titulo: "Cadastro realizado",
    descricao: "Sua conta foi criada. Agora é só entrar.",
  },
  SUCESSO_RECUPERA: {
    tom: "success",
    titulo: "Link enviado",
    descricao: "Enviamos as instruções de redefinição para o contato informado.",
  },
  SUCESSO_TOKEN: {
    tom: "success",
    titulo: "Código confirmado",
    descricao: "Você pode definir uma nova senha agora.",
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
} as const satisfies Record<string, MensagemAlerta>;

// nome de cada entrada do catalogo
export type ChaveAlerta = keyof typeof ALERTAS;