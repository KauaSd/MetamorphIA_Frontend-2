import {
  validarSenha,
  REGRAS_SENHA,
} from "@/utils/validacao";
import { Check, X } from "@phosphor-icons/react/dist/ssr";

// encolhe o texto do checklist de senha em viewport baixa
const TEXTO_CURTO = "[@media(max-height:960px)]:text-xs";

// checklist das regras de senha, usado pelo FormCadastro
export function RegrasSenha({ senha }: { senha: string }) {
  const pendentes = validarSenha(senha);

  if (!senha || pendentes.length === 0) return null;

  return (
    <ul className={`mt-2 flex w-full flex-col gap-1.5 text-sm text-secondary ${TEXTO_CURTO}`}>
      {REGRAS_SENHA.map((regra) => {
        const cumprida = !pendentes.includes(regra.texto);

        return (
          <li key={regra.id} className="flex items-start gap-2">
            {cumprida ? (
              <Check
                weight="bold"
                size={16}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden
              />
            ) : (
              <X
                weight="bold"
                size={16}
                className="mt-0.5 shrink-0 text-secondary"
                aria-hidden
              />
            )}

            <span className={cumprida ? "text-primary" : undefined}>
              {regra.texto}
            </span>
          </li>
        );
      })}
    </ul>
  );
}