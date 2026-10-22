"use client";

import { useMemo, useState } from "react";
import HeaderPagEscolas from "@/components/app/escolas/HeaderPagEscolas";
import BarraPesquisa from "@/components/common/Input";
import Escola, { type TurmaResumo } from "@/components/app/escolas/Escola";
import BoxSemEscola from "@/components/app/escolas/BoxSemEscola";
import Toast, { useAlerta } from "@/components/common/Toast";
import { FormEscola, FormDeletaEscola } from "@/components/app/forms/FormEscola";
import { useData } from "@/components/app/state/DataProvider";
import { createEscola, deleteEscola, updateEscola, type Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";

export default function ConteudoEscolas() {
  const { escolas, turmas, recarregar } = useData();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("az");
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const { alerta, mostrar, limpar } = useAlerta();

  const escolaEmEdicao = idEmEdicao
    ? escolas.find((escola) => escola.id === idEmEdicao)
    : undefined;
  const escolaEmExclusao = idEmExclusao
    ? escolas.find((escola) => escola.id === idEmExclusao)
    : undefined;

  const turmasPorEscolaId = useMemo(() => {
    const mapa = new Map<string, TurmaResumo[]>();
    for (const turma of turmas) {
      if (!turma.escolaId) continue;
      const lista = mapa.get(turma.escolaId) ?? [];
      lista.push({ id: turma.id, nome: turma.nome });
      mapa.set(turma.escolaId, lista);
    }
    return mapa;
  }, [turmas]);

  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
  }

  async function aoCriar(nome: string): Promise<Resultado> {
    const resultado = await createEscola({ nome });
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function aoEditar(nome: string): Promise<Resultado> {
    if (!idEmEdicao) {
      return tentar({ ok: false, erro: ALERTAS.ESCOLA_NAO_ENCONTRADA });
    }
    const resultado = await updateEscola(idEmEdicao, { nome });
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function confirmarExclusao(): Promise<Resultado> {
    if (!idEmExclusao) {
      return tentar({ ok: false, erro: ALERTAS.ESCOLA_NAO_ENCONTRADA });
    }
    const resultado = await deleteEscola(idEmExclusao);
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  const escolasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtradas = termo
      ? escolas.filter((escola) => escola.nome.toLowerCase().includes(termo))
      : escolas;

    const descending = ordenacao === "za";
    return filtradas.toSorted((a, b) =>
      descending
        ? b.nome.localeCompare(a.nome, "pt-BR")
        : a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [escolas, busca, ordenacao]);

  const temEscola = escolas.length > 0;
  const temResultado = escolasFiltradas.length > 0;

  return (
    <div className="flex flex-col w-full min-h-screen items-center">
      <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPagEscolas
          onCriarEscola={() => setMostrarForm(true)}
          ordenacao={ordenacao}
          onMudarOrdenacao={setOrdenacao}
        />
        <BarraPesquisa
          type="search"
          placeholder="Procurar escolas..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      {temResultado ? (
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 xl:gap-8 mt-6 sm:mt-10 w-full">
            {escolasFiltradas.map((escola) => (
              <Escola
                key={escola.id}
                nomeEscola={escola.nome}
                turmas={turmasPorEscolaId.get(escola.id) ?? []}
                href={`/dashboardEscola?id=${escola.id}`}
                onEditar={() => setIdEmEdicao(escola.id)}
                onExcluir={() => setIdEmExclusao(escola.id)}
              />
            ))}
          </div>
        </div>
      ) : temEscola ? (
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-2 py-16">
          <p className="text-lg text-secondary">Nenhuma escola encontrada</p>
          <p className="text-sm text-ink-muted">Tente outro termo de busca.</p>
        </div>
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <BoxSemEscola onCriarEscola={() => setMostrarForm(true)} />
        </div>
      )}

      {mostrarForm ? (
        <FormEscola onClose={() => setMostrarForm(false)} onSalvar={aoCriar} />
      ) : null}

      {escolaEmEdicao ? (
        <FormEscola
          modo="editar"
          nomeInicial={escolaEmEdicao.nome}
          onClose={() => setIdEmEdicao(null)}
          onSalvar={aoEditar}
        />
      ) : null}

      {escolaEmExclusao ? (
        <FormDeletaEscola
          nomeEscola={escolaEmExclusao.nome}
          onClose={() => setIdEmExclusao(null)}
          onExcluir={confirmarExclusao}
        />
      ) : null}

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
