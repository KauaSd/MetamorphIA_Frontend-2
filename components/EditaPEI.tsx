interface Tipoprops {
    ativado: boolean
}

export default function EditaPEI({ ativado }: Tipoprops) {
    return (
        <div className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-31 rounded-[50px] select-none cursor-pointer ${ativado ? 'bg-[#C9F9FE]' : 'bg-[#FF9999]'}`}>
            <p className="text-sm sm:text-base text-[#433F3F] whitespace-nowrap">
                {ativado ? "Editar PEI" : "Ativar PEI"}
            </p>
        </div>
    )
}