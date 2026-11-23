"use client";

import Button from "@/components/common/Button";
import { OverlayCarregando } from "@/components/common/Carregando";
import { X } from 'lucide-react'
import Blurfundo from "@/components/common/Blurfundo";
import { RegrasSenha } from "@/components/app/auth/RegrasSenha";
import Input from "@/components/common/Input";
import { useState } from "react";
import ButtonLink from "@/components/common/ButtonLink";
import Toast from "@/components/common/Toast";
import type { MensagemAlerta } from "@/utils/alertas";
import { validarSenha } from "@/utils/validacao";
import { useRouter } from "next/navigation";
import {
  apiDbFetch,
  clearAuthSession,
  getAuthToken,
  getPendingResetToken,
  getSavedUserProfile,
  setAuthTokens,
  setPendingResetIdentifier,
  setPendingResetToken,
} from "@/utils/apiClient";

interface FormProps {
  onClose: () => void;
}

interface ModalConfirmacaoContaProps {
  titulo: string;
  pergunta: string;
  textoConfirmar: string;
  mensagemCarregando?: string;
  larguraFixa?: boolean;
  onClose: () => void;
  onConfirmar?: () => void | Promise<void>;
}

function ModalConfirmacaoConta({
  titulo,
  pergunta,
  textoConfirmar,
  mensagemCarregando = "Processando...",
  larguraFixa = false,
  onClose,
  onConfirmar,
}: ModalConfirmacaoContaProps) {
  const [processando, setProcessando] = useState(false);

  const executarConfirmacao = async () => {
    if (processando) return;
    setProcessando(true);
    try {
      await onConfirmar?.();
    } finally {
      setProcessando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void executarConfirmacao();
  };

  return (
    <Blurfundo onClose={processando ? undefined : onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative overflow-hidden flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <OverlayCarregando ativo={processando} mensagem={mensagemCarregando} />
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>{titulo}</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">{pergunta}</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" disabled={processando} onClick={onClose} className={`bg-surface-inverse text-inverse hover:bg-surface-inverse-hover${larguraFixa ? " w-32" : ""}`}>Cancelar</Button>
            <Button type="button" disabled={processando} onClick={() => void executarConfirmacao()} className={`bg-surface-danger text-ink hover:bg-surface-danger/80${larguraFixa ? " w-32 whitespace-nowrap" : ""}`}>{textoConfirmar}</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDeletaConta({onClose}: FormProps){
  const router = useRouter();
  async function confirmar() {
    const perfil = getSavedUserProfile();
    if (getAuthToken() && perfil?.id_usuario) {
      try {
        await apiDbFetch(`/autenticar/deletaProfessor/${perfil.id_usuario}`, {
          method: "DELETE",
        });
      } catch {}
    }
    clearAuthSession();
    onClose();
    router.push("/auth/login");
  }
  return (
    <ModalConfirmacaoConta
      titulo="Excluir"
      pergunta="Tem certeza de que deseja excluir a conta?"
      textoConfirmar="Excluir"
      mensagemCarregando="Excluindo conta..."
      larguraFixa
      onClose={onClose}
      onConfirmar={confirmar}
    />
  );
}

export function FormDesconectaTodos({onClose}: FormProps){
  const router = useRouter();
  async function confirmar() {
    if (getAuthToken()) {
      try {
        await apiDbFetch("/autenticar/desconectar-todos", {
          method: "POST",
        });
      } catch {}
    }
    clearAuthSession();
    onClose();
    router.push("/auth/login");
  }
  return (
    <ModalConfirmacaoConta
      titulo="Desconectar"
      pergunta="Tem certeza de que deseja desconectar de todos os dispositivos?"
      textoConfirmar="Desconectar"
      mensagemCarregando="Desconectando..."
      onClose={onClose}
      onConfirmar={confirmar}
    />
  );
}

export function FormDesconecta({onClose}: FormProps){
  const router = useRouter();
  function confirmar() {
    clearAuthSession();
    onClose();
    router.push("/auth/login");
  }
  return (
    <ModalConfirmacaoConta
      titulo="Sair"
      pergunta="Tem certeza de que deseja sair deste dispositivo?"
      textoConfirmar="Sair"
      onClose={onClose}
      onConfirmar={confirmar}
    />
  );
}

export function FormAlterarSenha({onClose}: Partial<FormProps>){
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    if (onClose && !senhaAtual.trim()) {
      setAlerta({
        tom: "danger",
        titulo: "Informe a senha atual",
        descricao: "Digite sua senha atual para confirmar a alteração.",
      });
      return;
    }

    if (!senha.trim()) {
      setAlerta({
        tom: "danger",
        titulo: "Informe a nova senha",
        descricao: "Digite sua nova senha antes de continuar.",
      });
      return;
    }

    if (validarSenha(senha).length > 0) {
      setAlerta({
        tom: "danger",
        titulo: "Senha fraca",
        descricao: "A senha precisa cumprir todos os requisitos listados.",
      });
      return;
    }

    if (senha !== senha2) {
      setAlerta({
        tom: "danger",
        titulo: "Senhas diferentes",
        descricao: "A confirmação precisa ser igual à nova senha.",
      });
      return;
    }

    setSalvando(true);
    try {
      if (!onClose) {
        const resetToken = getPendingResetToken();
        if (!resetToken) {
          setAlerta({
            tom: "danger",
            titulo: "Sessão expirada",
            descricao: "Solicite um novo código de recuperação de senha.",
          });
          setSalvando(false);
          return;
        }
        const resp = await apiDbFetch("/autenticar/redefinir-senha", {
          method: "POST",
          body: JSON.stringify({
            reset_token: resetToken,
            nova_senha: senha,
          }),
        });
        if (!resp.ok) {
          const erroJson = (await resp.json().catch(() => ({}))) as { detail?: string };
          setAlerta({
            tom: "danger",
            titulo: "Não foi possível redefinir a senha",
            descricao: erroJson.detail || "Tente novamente.",
          });
          setSalvando(false);
          return;
        }
        setPendingResetToken(null);
        setPendingResetIdentifier(null);
        router.push("/auth/senhaAlterada");
        return;
      }

      const resp = await apiDbFetch("/autenticar/alterar-senha", {
        method: "PUT",
        body: JSON.stringify({
          senha_atual: senhaAtual,
          nova_senha: senha,
        }),
      });
      if (!resp.ok) {
        const erroJson = (await resp.json().catch(() => ({}))) as { detail?: string };
        setAlerta({
          tom: "danger",
          titulo: "Não foi possível alterar a senha",
          descricao: erroJson.detail || "Verifique sua sessão e tente novamente.",
        });
        setSalvando(false);
        return;
      }
      const dadosAlt = (await resp.json().catch(() => ({}))) as {
        access_token?: string;
        refresh_token?: string | null;
      };
      if (dadosAlt.access_token) {
        setAuthTokens(dadosAlt.access_token, dadosAlt.refresh_token);
        onClose();
      } else {
        clearAuthSession();
        onClose();
        router.push("/auth/login");
      }
    } catch {
      setAlerta({
        tom: "danger",
        titulo: "Erro de conexão",
        descricao: "Não foi possível conectar ao servidor.",
      });
      setSalvando(false);
    }
  };

  const formulario = (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      {alerta && (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      )}
      <div className="relative overflow-hidden flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <OverlayCarregando ativo={salvando} mensagem="Alterando senha..." />
        <div className="flex flex-col  gap-6">
          <div className={`flex items-center ${onClose ? "justify-between" : "justify-center"}`}>
            <p className={onClose
                ? "text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)"
                : "text-2xl text-primary sm:text-3xl text-center"
              }>Alterar Senha</p>
            {onClose && <BotaoFechar onClose={onClose} />}
          </div>
          <div className="flex flex-col gap-3">
            {onClose && (
              <>
                <p className="text-md text-primary text-justify">Digite sua senha atual:</p>
                <Input
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  disabled={salvando}
                />
              </>
            )}
            <p className="text-md text-primary text-justify">Digite sua nova senha:</p>
            <p className="text-xs text-secondary"> Esta ação será permanente e não poderá ser revertida.</p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={salvando}
            />
            <RegrasSenha senha={senha} />
            <p className="text-md text-primary text-justify">Confirme sua nova senha:</p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
              disabled={salvando}
            />
          </div>
        </div>

        <div className={`flex gap-5 ${onClose ? "self-end" : "justify-center"}`}>
          {onClose ? (
            <Button type="button" disabled={salvando} onClick={onClose} className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover">Cancelar</Button>
          ) : (
            <ButtonLink href="/auth/token" className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover">Cancelar</ButtonLink>
          )}
          <Button type="submit" disabled={salvando} className="bg-surface-danger text-ink hover:bg-surface-danger/80">Salvar</Button>
        </div>
      </div>
    </form>
  );

  return onClose ? <Blurfundo onClose={salvando ? undefined : onClose}>{formulario}</Blurfundo> : formulario;
}

function BotaoFechar({onClose}: { onClose: () => void;}) 
{
  return (
    <button
      type="button"
      aria-label="Fechar"
      onClick={onClose}
      className="flex cursor-pointer hover:text-secondary"
    >
      <X className="h-6 w-6" />
    </button>
  );
}
