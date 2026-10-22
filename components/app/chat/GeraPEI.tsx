interface Tipoprops {
    ativado: boolean
    desabilitado?: boolean
    onClick?: () => void
}

export default function GeraPEI({ ativado, desabilitado = false, onClick }: Tipoprops) {
    const clicavel = ativado && !desabilitado

    return (
        <button
            type="button"
            disabled={!clicavel}
            onClick={onClick}
            className={`flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 rounded-[50px] select-none w-full sm:w-auto transition-colors ${
                clicavel
                    ? "cursor-pointer bg-surface-warning text-ink hover:bg-warning"
                    : "cursor-default bg-surface-warning/50 text-ink/50"
            } disabled:opacity-50`}
        >
            <p className="text-sm sm:text-base whitespace-nowrap">
                Gerar PEI do aluno
            </p>
        </button>
    )
}
