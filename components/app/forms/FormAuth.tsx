"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import CheckBox from "@/components/common/CheckBox";
import Toast from "@/components/common/Toast";
import Button from "@/components/common/Button";
import ButtonLink from "@/components/common/ButtonLink";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OTPInput, SlotProps } from "input-otp";
import { ALERTAS, type MensagemAlerta } from "@/utils/alertas";
import {
  ehEmailOuTelefone,
  pareceTelefone,
  validarEmail,
  validarSenha,
  validarTelefone,
} from "@/utils/validacao";
import { RegrasSenha } from "@/components/app/RegrasSenha";


export function FormLogin() {
  const router = useRouter();
  const [identificador, setIdentificar] = useState("");
  const [senha, setSenha] = useState("");
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  function login(e: React.FormEvent) {
    e.preventDefault();

    if (!identificador.trim()) {
      setAlerta(ALERTAS.LOGIN_SEM_IDENTIFICADOR);
      return;
    }

    if (!senha.trim()) {
      setAlerta(ALERTAS.LOGIN_SEM_SENHA);
      return;
    }

    if (!ehEmailOuTelefone(identificador)) {
      setAlerta(ALERTAS.LOGIN_INVALIDO);
      return;
    }

    setAlerta(null);
    router.push("/alunos");
  }

  return (
    // formulario de login
    <form onSubmit={login} className="w-full max-w-md">
      {alerta && (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      )}

      {/* card do formulario */}
      <div className="flex w-full flex-col gap-5 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        {/* titulo */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-sm text-secondary">Já tem uma conta?</h1>
          <p className="text-2xl text-primary sm:text-3xl">Entre</p>
        </div>

        {/* campos de telefone ou e-mail e senha */}
        <div className="flex flex-col items-center gap-3">
          <Input
            type="text"
            placeholder="Digite seu telefone ou e-mail"
            value={identificador}
            onChange={(e) => setIdentificar(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {/* link para recuperar a senha */}
        <div className="flex flex-col items-end">
          <Link href="/auth/recuperaSenha">
            <p className="text-right text-sm text-secondary">
              <u>
                <b>Esqueci a senha</b>
              </u>
            </p>
          </Link>
        </div>
        {/* botao de enviar */}
          <Button type="submit">Entrar</Button>
        {/* link para o cadastro */}
        <div className="text-sm text-secondary flex flex-row items-center justify-center gap-1">
          <p> Não tem uma conta? </p>
          <Link href="/auth/cadastro">
            <p className="cursor-pointer">
              {" "}
              <u>
                <b>Cadastre-se</b>
              </u>{" "}
            </p>
          </Link>
        </div>
      </div>
    </form>
  );
}

export function FormCadastro() {
  const router = useRouter();
  // telefone e e-mail no mesmo campo: a deteccao acontece na validacao
  const [contato, setContato] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nome.trim()) {
      setAlerta(ALERTAS.CAD_NOME_VAZIO);
      return;
    }

    if (!contato.trim()) {
      setAlerta(ALERTAS.CAD_CONTATO_VAZIO);
      return;
    }

    // so digitos parece telefone; letras (com ou sem @) caem na validacao
    // de e-mail, assim "qualquer texto" nao acusa erro de telefone
    if (pareceTelefone(contato)) {
      if (!validarTelefone(contato)) {
        setAlerta(ALERTAS.CAD_TEL_INVALIDO);
        return;
      }
    } else if (!validarEmail(contato)) {
      setAlerta(ALERTAS.CAD_EMAIL_INVALIDO);
      return;
    }

    if (!senha.trim()) {
      setAlerta(ALERTAS.CAD_SENHA_VAZIO);
      return;
    }

    // senha fraca nao gera alert, o checklist abaixo do campo ja mostra
    if (validarSenha(senha).length > 0) return;

    if (!aceitaTermos) {
      setAlerta(ALERTAS.CAD_TERMOS);
      return;
    }

    setAlerta(null);
    router.push("/auth/login");
  }

  return (
    // formulario de cadastro
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {alerta && (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      )}

      {/* card do formulario */}
      <div className="flex w-full flex-col gap-5 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        {/* titulo */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-sm text-secondary">Não tem uma conta?</h1>
          <p className="text-2xl text-primary sm:text-3xl">Cadastre-se</p>
        </div>

        {/* campos de nome, contato (telefone ou e-mail), senha e o checklist */}
        <div className="flex flex-col items-center gap-3">
          <Input
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Digite seu telefone ou e-mail"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <RegrasSenha senha={senha} />
        </div>

        {/* checkbox dos termos */}
        <div className="flex flex-col items-center gap-2">
          <CheckBox
            checked={aceitaTermos}
            onChange={setAceitaTermos}
          />
        </div>

        {/* botao de enviar */}
        <Button type="submit">Cadastrar</Button>
        {/* link para o login */}
        <div className="text-sm text-secondary flex flex-row items-center justify-center gap-1">
          <p>Já tem uma conta?</p>
          <Link href="/auth/login">
            <p className="cursor-pointer">
              {" "}
              <u>
                <b>Entre</b>
              </u>{" "}
            </p>
          </Link>
        </div>
      </div>
    </form>
  );
}

export function FormRecuperaSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) {
      setAlerta(ALERTAS.RECUPERA_VAZIO);
      return;
    }

    if (!ehEmailOuTelefone(email)) {
      setAlerta(ALERTAS.RECUPERA_INVALIDO);
      return;
    }

    setAlerta(null);
    router.push("/auth/token");
  }

  return (
    // formulario de recuperacao de senha
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {alerta && (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      )}

      {/* card do formulario */}
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        {/* titulo e texto de instrucao */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl text-primary sm:text-3xl">Recuperar senha</p>
          <p className="text-sm text-secondary text-justify">Para redefinir sua senha, informe seu número de telefone ou e-mail cadastrado na sua conta e lhe enviaremos um link  com as instruções.</p>
        </div>

        {/* campo de e-mail ou telefone */}
        <div className="flex flex-col items-center">
          <Input type="text" placeholder="Digite seu e-mail ou telefone" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* botoes voltar e proximo */}
        <div className="flex gap-5">
          <ButtonLink
            href="/auth/login"
            className="bg-surface-inverse text-inverse"
          >
            Voltar
          </ButtonLink>
          <Button type="submit">Próximo</Button>
      </div>
      </div>
    </form>
  );
}

export function FormToken() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (value.length !== 6) {
      setAlerta(ALERTAS.TOKEN_INCOMPLETO);
      return;
    }

    setAlerta(null);
    router.push("/auth/alterarSenha");
  }

  return (
    // formulario de confirmacao do codigo
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {alerta && (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      )}

      {/* card do formulario */}
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        {/* titulo e texto de instrucao */}
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl text-primary sm:text-3xl text-center">Digite o código de verificação</p>
          <p className="text-sm text-secondary text-justify">Enviamos um código de 6 dígitos para seu e-mail/telefone. Por favor, insira-o abaixo.</p>
        </div>

        {/* campo de codigo de 6 digitos */}
        <div className="flex flex-col items-center">
          <OTPInput
        maxLength={6}
        value={value}
        onChange={setValue}
        containerClassName="flex gap-2"
        render={({ slots }) => (
          <div className="flex gap-4">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
        </div>

        {/* botoes voltar e verificar */}
        <div className="flex gap-5">
          <ButtonLink
            href="/auth/recuperaSenha"
            className="bg-surface-inverse text-inverse"
          >
            Voltar
          </ButtonLink>
          <Button type="submit">Verificar</Button>
        </div>
        </div>
      </form>
    );
}
// caixa de cada digito do codigo, usado pelo render do OTPInput
function Slot( props: SlotProps){
    return(
    <div
      className={`w-10 h-14 flex items-center justify-center text-xl font-semibold bg-sunken rounded-full
      }`}
    >
      {props.char}
      {props.hasFakeCaret &&(
        <div className="absolute w-0.5 h-5 bg-surface-inverse animate-caret-blink" />
      )}
    </div>
    )
}