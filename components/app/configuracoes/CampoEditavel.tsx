"use client";

interface CampoEditavelProps {
  /** texto do rascunho, controlado pelo pai */
  valor: string;
  /** chamado a cada tecla com o texto digitado; o salvamento mora no pai */
  aoDigitar: (valor: string) => void;
  placeholder?: string;
}

/**
 * Campo de texto enxuto para editar na hora: so digita e o pai acompanha.
 * Salvar/cancelar nao sao daqui — ficam na barra de alteracoes da tela.
 */
export default function CampoEditavel({
  valor,
  aoDigitar,
  placeholder = "Não definido",
}: CampoEditavelProps) {
  return (
    <div className="rounded-[70px] bg-sunken px-8 py-1 text-[18px]">
      <input
        type="text"
        aria-label="Valor"
        value={valor}
        placeholder={placeholder}
        onChange={(e) => aoDigitar(e.target.value)}
        // size acompanha o tamanho do texto (fallback onde nao ha
        // field-sizing); field-sizing-content faz a pill crescer pixel a
        // pixel nos navegadores que suportam
        size={Math.max(valor.length, 13)}
        className="field-sizing-content bg-transparent text-[18px] outline-none placeholder:text-secondary"
      />
    </div>
  );
}
