"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import BarraPesquisa from "@/components/common/Input";
import Button from "@/components/common/Button";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import BoxVazio from "@/components/common/BoxVazio";
import VerMais from "@/components/common/VerMais";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import FormProfessor from "@/components/app/forms/FormProfessor";
import Toast, { useAlerta } from "@/components/common/Toast";
import { useData } from "@/components/app/state/DataProvider";
import {
  enviarConviteProfessorEscola,
  listarProfessoresEscola,
} from "@/utils/data/apiRepository";
import { turmasDaEscola } from "@/utils/data/types";
import AdcProfIcon from "@/public/adcprof.svg";

interface ProfessorItem {
  id: string;
  nome: string;
  email?: string;
  turmasTexto: string;
  lecionaTexto: string;
  local?: boolean;
}

const OPCOES_ORDENACAO: DropDownOption[] = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

const STORAGE_KEY_PREFIX = "metamorphia:adm:professores:";

function lerProfessoresLocais(escolaId: string): ProfessorItem[] {
  if (typeof window === "undefined" || !escolaId) return [];
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${escolaId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{ id: string; nome: string; turma?: string }>;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      id: p.id,
      nome: p.nome,
      turmasTexto: p.turma || "Sem turma",
      lecionaTexto: "Professor",
      local: true,
    }));
  } catch {
    return [];
  }
}

export default function ConteudoProfessores() {
  const router = useRouter();
  const { escolas, turmas, ehAdmin, ehAdminRede, escolaAdmId, hydrated } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("az");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [emailProfessor, setEmailProfessor] = useState("");
  const [turmaProfessor, setTurmaProfessor] = useState("");
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null);
  const [edicaoId, setEdicaoId] = useState<string | null>(null);

  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydrated && !ehAdmin) {
      router.replace("/alunos");
    }
  }, [hydrated, ehAdmin, router]);

  useEffect(() => {
    if (!menuAbertoId) return;
    function clicarFora(e: MouseEvent) {
      if (listaRef.current && !listaRef.current.contains(e.target as Node)) {
        setMenuAbertoId(null);
      }
    }
    function fecharEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbertoId(null);
    }
    document.addEventListener("mousedown", clicarFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("mousedown", clicarFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [menuAbertoId]);

  const escolaAlvo = useMemo(() => {
    if (escolaAdmId) {
      const encontrada = escolas.find((e) => e.id === escolaAdmId);
      if (encontrada) return encontrada;
    }
    return (
      escolas.find(
        (e) =>
          e.papel === "adm" &&
          (e.institucional || (e.plano ?? "").toLowerCase().includes("institucional")),
      ) ??
      escolas.find((e) => e.papel === "adm") ??
      escolas[0]
    );
  }, [escolas, escolaAdmId]);

  const escolaId = escolaAlvo?.id ?? "";
  const [professoresLocais, setProfessoresLocais] = useState<ProfessorItem[]>(() =>
    lerProfessoresLocais(escolaId),
  );

  const turmasParaForm = useMemo<DropDownOption[]>(() => {
    const lista = escolaId ? turmasDaEscola(turmas, escolaId) : turmas;
    return lista.map((t) => ({ value: t.id, label: t.nome }));
  }, [turmas, escolaId]);

  const professoresQuery = useQuery({
    queryKey: ["escola-professores", escolaId],
    queryFn: ({ signal }) => listarProfessoresEscola(escolaId, signal),
    enabled: Boolean(escolaId),
  });

  const professores = useMemo<ProfessorItem[]>(() => {
    const daApi: ProfessorItem[] = (professoresQuery.data ?? []).map((p) => ({
      id: String(p.id_usuario),
      nome: p.nome_usuario || p.email_usuario || "Professor",
      email: p.email_usuario ?? undefined,
      turmasTexto: p.turma?.trim() || "Sem turma",
      lecionaTexto:
        p.tags_areas && p.tags_areas.length > 0
          ? p.tags_areas.join(" • ")
          : p.papel === "adm"
            ? "Administrador"
            : "Professor",
      local: false,
    }));

    if (daApi.length === 0) return professoresLocais;
    const nomesApi = new Set(daApi.map((p) => p.nome.trim().toLowerCase()));
    const extras = professoresLocais.filter(
      (p) => !nomesApi.has(p.nome.trim().toLowerCase()),
    );
    return [...daApi, ...extras];
  }, [professoresQuery.data, professoresLocais]);

  const professoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtrados = termo
      ? professores.filter(
          (p) =>
            p.nome.toLowerCase().includes(termo) ||
            p.turmasTexto.toLowerCase().includes(termo) ||
            p.lecionaTexto.toLowerCase().includes(termo),
        )
      : professores;

    const descending = ordenacao === "za";
    return filtrados.toSorted((a, b) =>
      descending
        ? b.nome.localeCompare(a.nome, "pt-BR")
        : a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [professores, busca, ordenacao]);

  async function salvarProfessor(dados: { email: string; turmaId: string }) {
    const limpo = dados.email.trim();
    if (!limpo) return;
    const turmaNome =
      turmasParaForm.find((t) => t.value === dados.turmaId)?.label ??
      (dados.turmaId.trim() || "Sem turma");

    if (!edicaoId && escolaId) {
      try {
        const res = await enviarConviteProfessorEscola(escolaId, {
          email: limpo,
          tags_areas: [],
        });
        mostrar({
          tom: "info",
          titulo: "Convite enviado",
          descricao: res.email_enviado
            ? `Link de convite enviado para ${limpo}.`
            : `Convite criado para ${limpo}${res.codigo_convite ? ` (código: ${res.codigo_convite})` : ""}.`,
        });
      } catch (err) {
        mostrar({
          tom: "danger",
          titulo: "Não foi possível enviar o convite",
          descricao: err instanceof Error ? err.message : "Tente novamente.",
        });
        return;
      }
    }

    let atualizados: ProfessorItem[];
    if (edicaoId) {
      atualizados = professoresLocais.map((p) =>
        p.id === edicaoId ? { ...p, turmasTexto: turmaNome } : p,
      );
    } else {
      atualizados = [
        ...professoresLocais,
        {
          id: `prof-${Date.now()}`,
          nome: limpo,
          email: limpo,
          turmasTexto: turmaNome,
          lecionaTexto: "Professor",
          local: true,
        },
      ];
    }

    setProfessoresLocais(atualizados);
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${escolaId}`,
        JSON.stringify(
          atualizados.map((p) => ({
            id: p.id,
            nome: p.nome,
            turma: p.turmasTexto,
            concluidos: 0,
            total: 0,
          })),
        ),
      );
    } catch {}

    setEmailProfessor("");
    setTurmaProfessor("");
    setEdicaoId(null);
    setMostrarForm(false);
  }

  function excluirProfessor(id: string) {
    const atualizados = professoresLocais.filter((p) => p.id !== id);
    setProfessoresLocais(atualizados);
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${escolaId}`,
        JSON.stringify(
          atualizados.map((p) => ({
            id: p.id,
            nome: p.nome,
            turma: p.turmasTexto,
            concluidos: 0,
            total: 0,
          })),
        ),
      );
    } catch {}
  }

  if (!hydrated || !ehAdmin) {
    return <CarregandoDashboard mensagem="Carregando professores..." />;
  }

  const temProfessores = professores.length > 0;
  const temResultado = professoresFiltrados.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-[1056px] flex-1 flex-col px-5 sm:px-8 lg:max-w-none lg:px-12 xl:px-[clamp(48px,13.5vw,259px)]">
      {/* Cabeçalho */}
      <div className="mt-8 flex w-full flex-col gap-4 sm:mt-12 sm:gap-5 lg:mt-20">
        <div className="flex w-full flex-row items-center justify-between gap-3">
          <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">
            Professores
          </p>

          <div className="flex shrink-0 flex-row items-center gap-2 sm:gap-[13px]">
            <span className="hidden whitespace-nowrap text-sm text-secondary sm:inline">
              Ordenar por
            </span>
            <DropDown
              options={OPCOES_ORDENACAO}
              value={ordenacao}
              onChange={setOrdenacao}
              small
            />
            {!ehAdminRede ? (
              <button
                type="button"
                onClick={() => {
                  setEdicaoId(null);
                  setEmailProfessor("");
                  setTurmaProfessor("");
                  setMostrarForm(true);
                }}
                aria-label="Adicionar Professores"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-accent hover:bg-surface-accent-strong sm:h-9 sm:w-9"
              >
                <img
                  src={AdcProfIcon.src}
                  className="h-5 w-5 object-contain sm:h-6 sm:w-6"
                  alt=""
                />
              </button>
            ) : null}
          </div>
        </div>

        <BarraPesquisa
          type="search"
          placeholder="Procurar professores..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Lista ou Estado Vazio */}
      {temResultado ? (
        <div ref={listaRef} className="mt-6 w-full sm:mt-10">
          <div className="w-full rounded-[32px] bg-surface-base px-6 py-2">
            <div className="divide-y divide-sunken">
              {professoresFiltrados.map((prof) => {
                const aberto = menuAbertoId === prof.id;
                return (
                  <div
                    key={prof.id}
                    className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="truncate font-(family-name:--font-poppins) text-base text-primary sm:text-lg">
                      {prof.nome}
                    </p>

                    <div className="flex min-w-0 shrink-0 items-center justify-between gap-4 sm:justify-end">
                      <div className="flex min-w-0 flex-col items-start sm:items-end">
                        <span className="max-w-full truncate font-(family-name:--font-poppins) text-sm text-secondary">
                          {prof.turmasTexto}
                        </span>
                        <span className="max-w-full truncate font-(family-name:--font-poppins) text-sm text-secondary">
                          {prof.lecionaTexto}
                        </span>
                      </div>

                      <div className={`relative ${aberto ? "z-50" : "z-20"}`}>
                        <button
                          type="button"
                          onClick={() =>
                            setMenuAbertoId((prev) => (prev === prof.id ? null : prof.id))
                          }
                          aria-label={`Opções de ${prof.nome}`}
                          aria-haspopup="menu"
                          aria-expanded={aberto}
                          className="flex cursor-pointer items-center justify-center text-primary"
                        >
                          <EllipsisVertical height="22px" />
                        </button>

                        {aberto ? (
                          <div className="absolute right-0 top-full z-50 mt-2">
                            <VerMais
                              onEditar={() => {
                                setMenuAbertoId(null);
                                setEdicaoId(prof.id);
                                setEmailProfessor(prof.email || prof.nome);
                                setTurmaProfessor("");
                                setMostrarForm(true);
                              }}
                              onExcluir={() => {
                                setMenuAbertoId(null);
                                excluirProfessor(prof.id);
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : temProfessores ? (
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 py-16">
          <p className="text-lg text-secondary">Nenhum professor encontrado</p>
          <p className="text-sm text-ink-muted">Tente outro termo de busca.</p>
        </div>
      ) : (
        <div className="flex w-full flex-1 items-center justify-center py-8">
          <BoxVazio
            titulo="Nenhum professor encontrado"
            descricao="Chame professores para a sua escola para visualizá-los nesta tela."
            acao={
              !ehAdminRede ? (
                <Button
                  type="button"
                  onClick={() => setMostrarForm(true)}
                  className="flex w-auto flex-row items-center justify-center gap-2 px-5 py-1.5"
                >
                  <span className="whitespace-nowrap">Adicionar Professores</span>
                  <img src={AdcProfIcon.src} className="h-5 w-5 shrink-0" alt="" />
                </Button>
              ) : undefined
            }
          />
        </div>
      )}

      {/* Modal Adicionar / Editar Professor */}
      {mostrarForm ? (
        <FormProfessor
          key={edicaoId ?? "novo"}
          modo={edicaoId ? "editar" : "criar"}
          emailInicial={emailProfessor}
          turmaInicial={turmaProfessor}
          turmas={turmasParaForm}
          onClose={() => setMostrarForm(false)}
          onSalvar={(dados) => void salvarProfessor(dados)}
        />
      ) : null}

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
