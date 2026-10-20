"use client";

import { useMemo, useState } from "react";
import HeaderPagAl from "@/components/app/alunos/HeaderPagAl";
import BarraPesquisa from "@/components/common/Input";
import Aluno from "@/components/app/alunos/Aluno";
import BoxSemAluno from "@/components/app/alunos/BoxSemAluno";
import Toast, { useAlerta } from "@/components/common/Toast";
import { FormAluno, FormDeletaAluno, type DadosAluno } from "@/components/app/forms/FormAlunoTurma";
import { useData } from "@/components/app/state/DataProvider";
import { updateAluno, deleteAluno, type Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";

export default function ConteudoAlunos(){
    const { turmas, alunos, recarregar } = useData();
    const [busca, setBusca] = useState("");
    const [ordenacao, setOrdenacao] = useState("az");
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
    const { alerta, mostrar, limpar } = useAlerta();

    const turmasParaForm = useMemo(
        () => turmas.map((turma) => ({ value: turma.id, label: turma.nome })),
        [turmas],
    );

    const nomeTurmaPorId = useMemo(
        () => new Map(turmas.map((turma) => [turma.id, turma.nome])),
        [turmas],
    );

    const alunosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        const filtrados = termo
            ? alunos.filter((aluno) => aluno.nome.toLowerCase().includes(termo))
            : alunos;

        // "recente" cai para a-z: o dado de atividade nao esta no modelo ainda
        const descending = ordenacao === "za";
        return filtrados.toSorted((a, b) =>
            descending ? b.nome.localeCompare(a.nome, "pt-BR") : a.nome.localeCompare(b.nome, "pt-BR")
        );
    }, [alunos, busca, ordenacao]);

    const temAluno = alunos.length > 0;
    const temResultado = alunosFiltrados.length > 0;
    const alunoEmEdicao = idEmEdicao ? alunos.find((a) => a.id === idEmEdicao) : undefined;
    const alunoEmExclusao = idEmExclusao ? alunos.find((a) => a.id === idEmExclusao) : undefined;

    /** o form fica aberto e o toast aparece quando o controller recusa */
    async function tentar(resultado: Resultado): Promise<Resultado> {
        if (!resultado.ok) {
            mostrar(resultado.erro);
        }
        return resultado;
    }

    async function aoEditar(dados: DadosAluno): Promise<Resultado> {
        if (!idEmEdicao) {
            return tentar({ ok: false, erro: ALERTAS.ALUNO_NAO_ENCONTRADO });
        }
        const resultado = await updateAluno(idEmEdicao, dados);
        if (resultado.ok) {
            await recarregar();
        }
        return tentar(resultado);
    }

    async function confirmarExclusao(): Promise<Resultado> {
        if (!idEmExclusao) {
            return tentar({ ok: false, erro: ALERTAS.ALUNO_NAO_ENCONTRADO });
        }
        const resultado = await deleteAluno(idEmExclusao);
        if (resultado.ok) {
            await recarregar();
        }
        return tentar(resultado);
    }

    return(
        <div className="flex flex-col w-full min-h-screen items-center">
            <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
                <HeaderPagAl ordenacao={ordenacao} onOrdenacao={setOrdenacao} />
                <BarraPesquisa
                    type="search"
                    placeholder="Procurar alunos..."
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                />
            </div>
            {temResultado ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 mt-6 sm:mt-10 w-full">
                    {alunosFiltrados.map((aluno) => (
                        <Aluno
                            key={aluno.id}
                            nome={aluno.nome}
                            neuros={aluno.neuro}
                            Turma={nomeTurmaPorId.get(aluno.turmaId) ?? ""}
                            href={`/dashboardAluno?id=${aluno.id}`}
                            onEditar={() => setIdEmEdicao(aluno.id)}
                            onExcluir={() => setIdEmExclusao(aluno.id)}
                        />
                    ))}
                </div>
            ) : temAluno ? (
                <div className="flex flex-1 w-full flex-col items-center justify-center gap-2 py-16">
                    <p className="text-lg text-secondary">Nenhum aluno encontrado</p>
                    <p className="text-sm text-ink-muted">Tente outro termo de busca.</p>
                </div>
            ) : (
                <div className="flex w-full flex-1 items-center justify-center">
                    <BoxSemAluno />
                </div>
            )}

            {alunoEmEdicao ? (
                <FormAluno
                    turmas={turmasParaForm}
                    modo="editar"
                    nomeInicial={alunoEmEdicao.nome}
                    idadeInicial={alunoEmEdicao.idade}
                    neuroInicial={alunoEmEdicao.neuro}
                    turmaIdInicial={alunoEmEdicao.turmaId}
                    onClose={() => setIdEmEdicao(null)}
                    onSalvar={aoEditar}
                />
            ) : null}

            {alunoEmExclusao ? (
                <FormDeletaAluno
                    nomeAluno={alunoEmExclusao.nome}
                    onClose={() => setIdEmExclusao(null)}
                    onExcluir={confirmarExclusao}
                />
            ) : null}

            {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
        </div>
    );
}