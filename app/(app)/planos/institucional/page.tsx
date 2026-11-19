"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import { saveTeacherName } from "@/utils/data/controller";
import Button from "@/components/common/Button";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Blurfundo from "@/components/common/Blurfundo";
import { useData } from "@/components/app/state/DataProvider";

export default function institucional(nomeInicial = "",  componentesIniciais = [],
  escolaIdInicial = "",
  escolas: escolasProp,){
  const handleVoltar = () => {
    if (window.history.length > 1) {
      router.back();
    } else {        
      router.push("/planos");
    }
  };

  const { escolas: escolasData } = useData();
  const [nomeTurma, setNomeTurma] = useState(nomeInicial);
  const [componentes, setComponentes] = useState<string[]>(componentesIniciais);
  const [escolaId, setEscolaId] = useState(escolaIdInicial);
  const [salvando, setSalvando] = useState(false);

  const listaEscolas = useMemo(() => {
    if (escolasProp) return escolasProp;
    return (escolasData ?? []).map((e) => ({ value: e.id, label: e.nome }));
  }, [escolasProp, escolasData]);

  const opcoesEscolas: DropDownOption[] = useMemo(() => {
    if (listaEscolas.length === 0) {
      return [{ value: "", label: "Sem escola" }];
    }
    return [
      { value: "", label: "Sem escola" },
      ...listaEscolas,
    ];
  }, [listaEscolas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    try {
      // quem valida o nome vazio e o controller; o form so fecha se der ok
      const resultado = await onSalvar(
        nomeTurma.trim(),
        componentes,
        escolaId || undefined
      );
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  

  return(
    <div className="flex h-full w-full items-center justify-center bg-surface-muted px-10 max-lg:h-auto max-lg:px-4 max-lg:py-8">
<div className="flex h-[796px] max-w-[560px] flex-[866] flex-col rounded-[50px] bg-surface-base p-10 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-[796px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:max-w-[560px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:rounded-[40px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:p-8 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-[796px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:max-w-[560px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:rounded-[34px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:p-6 max-lg:h-auto max-lg:w-full max-lg:max-w-[560px] max-lg:flex-none max-lg:rounded-[32px] max-lg:p-5 sm:max-lg:p-7">
        <div className="inst e seta flex gap-2 items-center">
            <button
            type="button"
            aria-label="Voltar"
            onClick={handleVoltar}
            className="cursor-pointer text-primary transition-colors hover:text-secondary"
          >
            <ChevronLeft className="h-6 w-6 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:w-5 max-lg:h-5 max-lg:w-5" />
          </button>
          <div className="h-fit w-fit rounded-3xl bg-surface-warning px-3 py-1 text-xs [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:px-2.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-0.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-[11px] max-lg:px-2.5 max-lg:py-0.5 max-lg:text-[11px]">
                <span className="font-bold text-ink">INSTITUCIONAL</span>
              </div>
            </div>
            <div className="mt-8.25">
                <div className = "flex flex-col items-center justify-center gap-3 "> 
                <h1 className="text-[28px] text-center">Qual tamanho <br/>da sua instituição? </h1> 
                <span className="text-sm">Vamos ajustar o plano ao tamanho da sua rede.</span></div>
                <div className = "flex items-center justify-center gap-10 mt-9">
                    <div className="w-[191px] h-[91px] border-3 border-surface-warning rounded-[30px] px-4 py-2 flex flex-col"><h1 className="text-[28px]">1 escola</h1> <span className="text-sm">Institucional</span></div>
 <div className="w-[191px] h-[91px] border-3 border-surface-warning rounded-[30px] px-4 py-2 flex flex-col"><h1 className="text-[28px]">2 ou mais </h1> <span className="text-sm">Institucional+</span></div>
                </div>
            <DropDown
              options={opcoesEscolas}
              value={escolaId}
              onChange={setEscolaId}
              placeholder="Sem escola"
            />
            </div>
        <div className= "linha"></div>
        <div className= "coiso do plano">

        </div>
        {/* botão */}
    </div>
    </div>
  )
}}