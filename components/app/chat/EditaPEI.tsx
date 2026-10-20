interface Tipoprops {
    ativado: boolean
    desabilitado?: boolean
}

export default function EditaPEI({ ativado, desabilitado = false }: Tipoprops) {
    return (
        <button
            type="button"
            disabled={desabilitado}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-31 rounded-[50px] select-none transition-opacity ${desabilitado ? 'cursor-default' : 'cursor-pointer'} ${ativado ? 'bg-[#C9F9FE]' : 'bg-[#FF9999]'} disabled:opacity-50`}
        >
            <p className="text-sm sm:text-base text-[#433F3F] whitespace-nowrap">
                {ativado ? "Editar PEI" : "Ativar PEI"}
            </p>
        </button>
    )
}
