import ButtonLink from "@/components/common/ButtonLink";
import BoxVazio from "@/components/common/BoxVazio";

export default function BoxSemAluno() {
  return (
    <BoxVazio
      titulo="Nenhum aluno encontrado"
      descricao="Adicione um aluno em uma de suas turmas para visualizá-lo nesta tela."
      comMargemHorizontal={false}
      acao={
        <ButtonLink href="/turmas" className="w-full max-w-[180px] px-3 py-1 sm:px-4 sm:py-1">
          Ir para Turmas
        </ButtonLink>
      }
    />
  );
}
