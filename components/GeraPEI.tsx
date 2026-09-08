interface Tipoprops {
    ativado: boolean
}

export default function GeraPEI({ ativado }: Tipoprops) {
    return (
        <div className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-[50px] select-none w-full sm:w-auto ${ativado ? 'bg-[#FFD279] cursor-pointer' : 'bg-[#FFD279]/50'}`}>
            <p className={`text-sm sm:text-base whitespace-nowrap ${ativado ? 'text-[#433F3F]' : 'text-[#433F3F]/50'}`}>
                Gerar PEI do aluno
            </p>
        </div>
    )
}