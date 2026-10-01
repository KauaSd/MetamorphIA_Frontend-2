import Editar from "@/public/EditarIcon.svg";
import Deletar from "@/public/DeletaIcon.svg";
import Encaracolado from "@/components/common/Encaracolado";

interface VerMaisProps {
    onEditar: () => void;
    onExcluir: () => void;
}

export default function VerMais({
    onEditar, onExcluir
}: VerMaisProps){
    return(
        <div className="w-25 h-auto rounded-[15px] bg-sunken text-primary shadow-lg p-2">
            <button type="button" onClick={onEditar} className="flex items-center gap-2 w-full p-2 rounded-[15px] hover:bg-surface-base cursor-pointer">
                <Encaracolado src={Editar.src} className="h-[11px] w-[11px] shrink-0" />
                <p>Editar</p>
            </button>
            <button type="button" onClick={onExcluir} className="flex items-center gap-2 w-full p-2 rounded-[15px] hover:bg-surface-base cursor-pointer">
                <Encaracolado src={Deletar.src} className="h-[11px] w-[9px] shrink-0" />
                <p>Excluir</p>
            </button>
        </div>
    )
}
