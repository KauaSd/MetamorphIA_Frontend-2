import Inicio from "@/public/ImgInicio.svg";
import Fim from "@/public/ImgFim.svg";

interface TituloTermoProps{
    titulo: string;
}

export default function Titulo({ titulo }: TituloTermoProps){
    return(
        <div className="inline-flex items-center">
            <img src={Inicio.src} className="h-10 w-auto pointer-none select-none" />
            <div className="font-(family-name:--font-text-me-one) text-2xl bg-[#D4C7F8]">
                <p>{titulo}</p>
            </div>
            <div>
                <img src={Fim.src} className="h-10 w-auto pointer-none select-none" />
            </div>
        </div>
    )
}