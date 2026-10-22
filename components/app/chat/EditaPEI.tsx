interface Tipoprops {
    ativado: boolean
    desabilitado?: boolean
}

export default function EditaPEI({ ativado, desabilitado = false }: Tipoprops) {
    return (
        <button
            type="button"
            disabled={desabilitado}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 w-full sm:w-31 rounded-[50px] select-none transition-colors ${
                desabilitado ? "cursor-default opacity-50" : "cursor-pointer"
            } ${
                ativado
                    ? "bg-surface-positive text-ink hover:bg-surface-positive/80"
                    : "bg-surface-danger text-ink hover:bg-surface-danger/80"
            }`}
        >
            <p className="text-sm sm:text-base whitespace-nowrap">
                {ativado ? "Editar PEI" : "Ativar PEI"}
            </p>
        </button>
    )
}
