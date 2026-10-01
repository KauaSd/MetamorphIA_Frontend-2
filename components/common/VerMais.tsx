import Editar from "@/public/EditarIcon.svg";
import Deletar from "@/public/DeletaIcon.svg";

interface VerMaisProps {
    onEditar: () => void;
    onExcluir: () => void;
}

export default function VerMais({
    onEditar, onExcluir
}: VerMaisProps){
    return(
        <div className="w-25 h-auto rounded-[15px] bg-[#FFFDFA] shadow-md p-2">
            <button type="button" onClick={onEditar} className="flex items-center gap-2 w-full p-2 rounded-[15px] hover:bg-[#F0F0F0] cursor-pointer">
                <img src={Editar.src} />
                <p>Editar</p>
            </button>
            <button type="button" onClick={onExcluir} className="flex items-center gap-2 w-full p-2 rounded-[15px] hover:bg-[#F0F0F0] cursor-pointer">
                <img src={Deletar.src} />
                <p>Excluir</p>
            </button>
        </div>
    )
}