"use client"

import HeaderPag from "@/components/app/HeaderDashTurma";
import { useSearchParams } from "next/navigation";
import BoxSemAlunoTurma from "@/components/app/BoxSemAlunoTurma";
import CarregandoDashboard from "@/components/app/CarregandoDashboard";
import { useData } from "@/components/app/state/DataProvider";
import { alunosDaTurma, turmaPorId } from "@/utils/data/types";
import { createAluno, updateAluno, deleteAluno } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
// import Estatistica from "@/components/app/CardEstatisticaTurma";
// import Resumo from "@/components/app/Resumo";
import Button from "@/components/common/Button";
import Toast, { useAlerta } from "@/components/common/Toast";
// import Engajamento from "@/components/app/Engajamento";
import Add from "@/public/add.svg";
import Aluno from "@/components/app/Aluno";
import { useState } from "react";
import { FormAluno, FormDeletaAluno, type DadosAluno } from "@/components/app/forms/FormAlunoTurma";

// const RESUMO_PADRAO_TURMA =
// "A turma apresenta perfil heterogêneo de aprendizagem. 5 alunos possuem laudos ou suspeitas de neurodivergência (TDAH, TEA, Dislexia). A maioria responde bem a atividades visuais e instruções segmentadas. Recomenda-se uso de recursos multissensoriais e tempos flexíveis nas avaliações."

export default function ConteudoDashboardTurma(){
    const [mostrarForm, setMostrarForm] = useState(false);
    const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
    const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const turmaId = searchParams.get("id");
    const { turmas, alunos, recarregar, hydrated } = useData();
    const { alerta, mostrar, limpar } = useAlerta();

    const turma = turmaId ? turmaPorId(turmas, turmaId) : undefined;
    const alunosDaTurmaList = turmaId ? alunosDaTurma(alunos, turmaId) : [];
    const temAlunos = alunosDaTurmaList.length > 0;

    const turmasParaForm = turmas.map((t) => ({ value: t.id, label: t.nome }));
    const alunoEmEdicao = idEmEdicao ? alunosDaTurmaList.find((a) => a.id === idEmEdicao) : undefined;
    const alunoEmExclusao = idEmExclusao ? alunosDaTurmaList.find((a) => a.id === idEmExclusao) : undefined;

    // o Resumo e editavel; enquanto nao houver edicao vale o textoPadrao,
    // depois passa a valer o que foi salvo
    const [resumo, setResumo] = useState("");

    /** o form fica aberto e o toast aparece quando o controller recusa */
    async function tentar(resultado: Resultado): Promise<Resultado> {
        if (!resultado.ok) {
            mostrar(resultado.erro);
        }
        return resultado;
    }

    async function aoCriar(dados: DadosAluno): Promise<Resultado> {
        const resultado = await createAluno(dados);
        if (resultado.ok) {
            await recarregar();
        }
        return tentar(resultado);
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

    // antes de hidratar, a lista viria vazia e o cabecalho sem nome
    if (!hydrated) {
        return <CarregandoDashboard />;
    }

    return(
        // dashboard da turma
    <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
                    {/* header */}
                    <div className="flex w-full flex-col">
                        <HeaderPag nomeTurma={turma?.nome} totalAlunos={alunosDaTurmaList.length} />
                    </div>
                    {/* lista de alunos */}
                    <div className="flex flex-col gap-7 pb-6">
                        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                            <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Alunos</p>
                            <Button type="button" onClick={() => setMostrarForm(true)} className="flex w-auto flex-row items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-1">
                                <img src={Add.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
                                <span className="whitespace-nowrap">Novo Aluno</span>
                            </Button>
                        </div>
                        {!temAlunos && (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <BoxSemAlunoTurma onCriarAluno={() => setMostrarForm(true)} />
                            </div>
                        )}
                        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
                        {alunosDaTurmaList.map((aluno) => (
                            <Aluno
                                key={aluno.id}
                                nome={aluno.nome}
                                neuros={aluno.neuro}
                                Turma={turma?.nome ?? ""}
                                href={`/dashboardAluno?id=${aluno.id}`}
                                onEditar={() => setIdEmEdicao(aluno.id)}
                                onExcluir={() => setIdEmExclusao(aluno.id)}
                            />
                        ))}
                        </div>

                        {/* forms de criar, editar e excluir aluno */}
                        {mostrarForm && (
                            <FormAluno
                                turmas={turmasParaForm}
                                turmaIdInicial={turmaId ?? ""}
                                onClose={() => setMostrarForm(false)}
                                onSalvar={aoCriar}
                            />
                        )}

                        {alunoEmEdicao && (
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
                        )}

                        {alunoEmExclusao && (
                            <FormDeletaAluno
                                nomeAluno={alunoEmExclusao.nome}
                                onClose={() => setIdEmExclusao(null)}
                                onExcluir={confirmarExclusao}
                            />
                        )}
                    </div>

                    {alerta && <Toast alerta={alerta} limpar={limpar} />}
                </div>
    )
}