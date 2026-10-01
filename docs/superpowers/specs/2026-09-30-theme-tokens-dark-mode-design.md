# Tokens semânticos + modo escuro — Design

**Data:** 2026-09-30
**Status:** aprovado para planejamento
**Escopo:** estrutura de temas (claro + escuro) e refatoração de todas as cores hardcoded

---

## 1. Problema

O app tem uma esqueleto de tokens em `app/globals.css` (9 variáveis em `:root`,
mapeadas via `@theme inline`) que **não é usado por ninguém**. Na prática, a cor
está hardcoded em todo o código:

- **353** utilities de cor com hex, distribuídas em **61 arquivos `.tsx`** varridos
  (49 deles com pelo menos uma ocorrência de hex)
- **27 cores distintas** + 2 utilities nomeadas do Tailwind (`text-white`, `bg-black/50`)
- **15 usos com modificador de opacidade** (`bg-[#433F3F]/50`, `bg-[#FF9999]/80`, …)

Existe um toggle de tema em `components/app/Configuracoes.tsx:265` (`function Mode()`),
mas ele mantém estado local e contém `// PLACEHOLDER: if (mode === "dark") {} ...` —
ou seja, o botão existe e não faz nada.

Consequência: não há como escurecer a interface. Qualquer palette escuro exigiria
editar 353 pontos distribuídos em 49 arquivos.

## 2. Objetivos

1. Criar a estrutura de temas: tokens semânticos + atributo `data-theme` + persistência.
2. Adicionar o modo escuro **com os mesmos valores do modo claro** (decisão do usuário):
   a infraestrutura fica pronta e verificada, e o palette escuro real é desenhado
   depois, editando apenas um bloco de variáveis.
3. Refatorar todo o código para consumir tokens, deixando **zero hex** em `.tsx`.
4. Esta etapa é **visualmente neutra**: ao final, o app deve estar idêntico ao atual,
   com a única diferença de que agora o modo escuro existe e usa a mesma paleta.

## 3. Não objetivos

- Desenhar a paleta escura real (fica para depois; esta etapa só a habilita).
- Persistir tema em cookie ou no backend (não há backend neste repo).
- Refatorar SVGs para serem theme-aware (ver §9).
- Adicionar um terceiro estado "sistema" (`prefers-color-scheme`) ao toggle.
- Adicionar framework de testes (o projeto não tem; ver §8).

## 4. Decisões de mecanismo

Todas as decisões vêm da documentação que acompanha o Next.js 16.3 em
`node_modules/next/dist/docs/` (exigência do `AGENTS.md` da raiz).

### 4.1 Sem flash de tema

`<html>` recebe `data-theme="light"` + `suppressHydrationWarning`, e um `<script>`
inline em `<head>` (via `dangerouslySetInnerHTML`, com `try/catch`) lê o
`localStorage` e ajusta o atributo durante o parsing, antes do primeiro paint.

Base: `01-app/02-guides/preventing-flash-before-hydration.md`, seção "Themes".

Descartado: Client Component que renderiza com valor do client → hydration error.
Descartado: `useEffect` → roda depois do paint, o usuário vê o tema errado.
Descartado: ler `localStorage` no servidor → não existe no servidor.

### 4.2 Persistência: `localStorage`, nunca cookie

A mesma doc, seção "Storing the theme in a cookie", adverte explicitamente que ler
o cookie no root layout tira o app inteiro do prerender estático (e, sob Cache
Components, força bloqueio de todos os segmentos). Como não há backend, usamos
`localStorage` e o cookie fica descartado.

### 4.3 Remount do StrictMode em desenvolvimento

A mesma doc, seção "Re-applying attributes in development": o remount do StrictMode
reseta os atributos de `<html>` para só os que o React gerencia via JSX, apagando o
que o script inline gravou. O provider reaplica o atributo em `useLayoutEffect`
(no-op em produção).

### 4.4 Estado no React

`useState(DEFAULT_THEME)` com valor fixo, sincronizando a partir do `localStorage`
em `useLayoutEffect`. Isso **não** usa lazy initializer de propósito: um initializer
que lê `localStorage` renderia um valor diferente do SSR na primeira renderização do
cliente e causaria hydration mismatch. O `useLayoutEffect` roda antes do paint, então
não há flash, e o estado do React nunca diverge do DOM.

`color-scheme` é definido por CSS (`[data-theme="light"] { color-scheme: light }`),
e **não** pelo export `viewport` — o export `viewport.colorScheme` do Next é estático,
então ficaria divergente do tema real (ver
`01-app/03-api-reference/04-functions/generate-viewport.md`).

### 4.5 Sem `dark:` nos componentes

Os componentes nunca escrevem `dark:`. A inversão acontece exclusivamente nos valores
das variáveis CSS. Consequência: não é preciso `@custom-variant`, e nenhum
`prefers-color-scheme` é consultado — o que também elimina a classe inteira de bugs
de "tema do sistema diferente do tema escolhido".

## 5. Paleta

Três famílias. São 26 variáveis (mais que as ~18 inicialmente estimadas) porque o
inventário provou que **10 das 27 cores fazem dupla função** — a mesma cor é texto
primário *e* fundo de sidebar, ou fundo de página *e* texto-sobre-escuro. Cada dupla
vira dois tokens; sem isso o dark mode não tem como inverter a relação.

### 5.1 Superfície

| Token | Valor claro | Origem no código |
| --- | --- | --- |
| `--surface-base` | `#FFFDFA` | `bg-[#FFFDFA]` (33) — fundo da página, botões claros |
| `--surface-base-hover` | `#CAC7C2` | `hover:bg-[#CAC7C2]` (2) |
| `--surface-raised` | `#FAF8F5` | `bg-[#FAF8F5]` (2) — balão de mensagem |
| `--surface-overlay` | `#FFFFFF` | `bg-[#FFFFFF]` (1) — chip do checkbox |
| `--surface-overlay-hover` | `#EBEBEB` | `hover:bg-[#EBEBEB]` (1) |
| `--surface-neutral` | `#797979` | `bg-[#797979]` (3) — barras de accordion do FAQ |
| `--surface-muted` | `#F0F0F0` | `bg-[#F0F0F0]` (6), `from-[#F0F0F0]` (1) |
| `--surface-sunken` | `#D9D9D9` | `bg-[#D9D9D9]` (17) — inputs, chips |
| `--surface-sunken-hover` | `#C0C0C0` | `hover:bg-[#C0C0C0]` (2) |
| `--surface-inverse` | `#433F3F` | `bg-[#433F3F]` (19) — sidebar escura, overlay do `Blurfundo` |
| `--surface-inverse-hover` | `#4C4C4C` | `bg-[#4C4C4C]` (9) — item ativo do menu |
| `--surface-inverse-soft` | `#FFFDFA` | `bg-[#FFFDFA]/10` (1) — pílula translúcida sobre a sidebar |
| `--surface-accent` | `#D4C7F8` | `bg-[#D4C7F8]` (17) |
| `--surface-accent-strong` | `#AB97E0` | `bg-[#AB97E0]` (4) |
| `--surface-danger` | `#FF9999` | `bg-[#FF9999]` (9) — botão de apagar conta |
| `--surface-danger-strong` | `#FF5154` | `bg-[#ff5154]` (2) — tag Discalculia |
| `--surface-warning` | `#FFD279` | `bg-[#FFD279]` (10) |
| `--surface-warning-hover` | `#FFC164` | `hover:bg-[#FFC164]` (1) — botão "Sou escola" |
| `--surface-success` | `#CEFFCA` | `bg-[#CEFFCA]` (3) |
| `--surface-info` | `#CAF3FF` | `bg-[#CAF3FF]` (6) |
| `--surface-positive` | `#C9F9FE` | `bg-[#C9F9FE]` (1) — pílula "ligado" |
| `--surface-tag-other` | `#948F9E` | `bg-[#948F9E]` (2) — tag "Outro" |

### 5.2 Texto

| Token | Valor claro | Origem no código |
| --- | --- | --- |
| `--text-primary` | `#433F3F` | `text-[#433F3F]` (55) |
| `--text-secondary` | `#797979` | `text-[#797979]` (67) |
| `--text-tertiary` | `#555555` | `text-[#555555]` (1) — label de checkbox |
| `--text-inverse` | `#FFFDFA` | `text-[#FFFDFA]` (23), `text-[#FFFFFF]` (2), `text-white` (1) |
| `--text-inverse-muted` | `#F0F0F0` | `text-[#F0F0F0]` (7) — labels da sidebar |
| `--text-accent` | `#C5B4FF` | `text-[#C5B4FF]` (1), `text-[#D4C7F8]` (1) — valores de gráfico |
| `--text-danger` | `#FF8A8A` | `text-[#FF8A8A]` (2), `text-[#FF9999]` (3) — 404 e mensagens de erro |
| `--text-warning` | `#FFC164` | `text-[#FFC164]` (1), `text-[#FFD279]` (1) — valores de gráfico |

### 5.3 Linha e controle

A família se chama `--line-*` (não `--border-*`) porque o utility do Tailwind já
prefixa com `border-`: com `--border-accent` a classe viraria `border-border-accent`.
Com `--line-accent` fica `border-line-accent`, `divide-line-default` e
`bg-line-strong`, sem repetição.

| Token | Valor claro | Origem no código |
| --- | --- | --- |
| `--line-default` | `#D9D9D9` | `divide-[#D9D9D9]` (5), `border-[#D9D9D9]` |
| `--line-muted` | `#F0F0F0` | `border-[#F0F0F0]` (1) — borda de card em `Planos.tsx` |
| `--line-subtle` | `#FFFDFA` | `border-[#FFFDFA]` (2) — separador de accordion |
| `--line-strong` | `#797979` | `bg-[#797979]` como régua `h-px` (2) — `HeaderDashAl.tsx:8,10` |
| `--line-accent` | `#D4C7F8` | `border-[#D4C7F8]` (2) |
| `--line-warning` | `#FFD279` | `border-[#FFD279]` (1) |
| `--control-selected` | `#797979` | `bg-[#797979] border-[#797979]` (o checkbox marcado e desmarcado, `CheckBoxAl.tsx:21`) e o ponto `w-2 h-2 rounded-full` de `FormAuth.tsx:23` |

**`bg-[#797979]` é o único hex cujas 7 ocorrências se dividem em três papéis** —
`CheckBoxAl.tsx:21`, `HeaderDashAl.tsx:8,10`, `FormAuth.tsx:23` e
`app/(public)/page.tsx:252,281,310`. A divisão está acima, por arquivo.

As 2 ocorrências de `border-[#797979]` estão na mesma linha do checkbox
(`CheckBoxAl.tsx:21`) e portanto vão para `--control-selected`.

Os prefixos de utility `from-`/`to-` seguem exatamente a mesma regra de
`bg-`/`text-`. O único gradiente é `bg-linear-to-b from-[#F0F0F0] to-[#FF9999]/50`
em `app/not-found.tsx` → `from-surface-muted to-surface-danger/50`.

### 5.4 Colapsamentos e exceções

- `#A77464` (`bg-[#a77464]`, 2 usos) é o fallback de `colorMap` em `TagNeuro.tsx` e
  `TagAluno.tsx` para label de tag neurodescritivo desconhecido. colapsa em
  `--surface-tag-other` junto com `#948F9E`: as duas são "outra tag".
- `#FF9999` atende três papéis (botão de apagar conta, pílula "desligado" em
  `FormAuth` e cor do número 404 / mensagens de erro em `not-found.tsx` e
  `FormAuth`). Mesmo valor; `--surface-danger` para fundo e `--text-danger` para texto.
- `#FF5154` (`bg-[#ff5154]`, 2 usos) é a tag Discalculia. Não colapsa em
  `--surface-danger` porque é um vermelho distinctamente mais escuro →
  `--surface-danger-strong`. (A versão anterior deste spec listava
  `--text-danger-strong` com essa cor; não existe nenhum `text-[#FF5154]` no código.)
- `#D4C7F8` colapsa em `--text-accent` quando é texto (1 uso, valor de gráfico em
  `CardEstatisticaAluno.tsx:17`) e vira `--surface-accent` quando é fundo.
- `#FFD279` colapsa em `--text-warning` quando é texto (1 uso,
  `CardEstatisticaAluno.tsx:21`) e vira `--surface-warning` quando é fundo.
- `#3D3838` (`Configuracoes.tsx:109`) é quase idêntico a `#433F3F` → `--text-primary`.
- `#EDEBE8` (`Configuracoes.tsx:67`) é quase idêntico a `#F0F0F0` →
  `--text-inverse-muted`.
- `#CAF3FF` e `#C9F9FE` são quase idênticos, mas têm papéis diferentes (tag de
  neurodesc vs. pílula de estado), então **não** colapsam. Mantidos separados.
- `#FAF8F5` e `#FFFFFF` são quase idênticos, mas têm papéis diferentes e **não**
  colapsam: `#FAF8F5` (2 usos) é o balão de mensagem em `ChatTgAluno.tsx:29,33` →
  `--surface-raised`; `#FFFFFF` (1 uso) é o chip do checkbox em
  `CheckBoxAluno` → `--surface-overlay`.
- `caret-[#433F3F]` (1 uso) mapeia para `caret-[var(--text-primary)]`, sem criar
  token novo.

### 5.5 Colapsamentos que dependem do dark real

`--surface-raised` e `--surface-positive` guardam hoje diferenças de ~1–3 pontos
entre duas cores quase iguais. A escolha de qual fica é irrelevante no light e
**precisa ser revista** quando o palette escuro for desenhado.

## 6. Arquivos

### 6.1 Novos

- **`utils/theme.ts`** — sem `"use client"` nem `"use server"`. Exporta o tipo
  `Theme` (`"light" | "dark"`), `THEME_STORAGE_KEY`, `DEFAULT_THEME` e a string
  `THEME_INIT_SCRIPT` (o corpo do script inline, shareada entre o layout e o
  provider para que chave e lógica nunca divirjam).
- **`components/theme/ThemeProvider.tsx`** — `"use client"`. Context + `useTheme()`.
  Em `useLayoutEffect`: lê `localStorage`, aplica `data-theme` no `<html>`, sincroniza
  o estado. `setTheme(t)`: grava `localStorage`, aplica o atributo, atualiza o estado.

### 6.2 Alterados

- **`app/globals.css`** — tokens em `[data-theme="light"]` + bloco
  `[data-theme="dark"]` **idêntico** ao light (por decisão do usuário), cada família
  com comentário, mais `color-scheme` por seletor. `@theme inline` mapeia cada
  `--color-*` para a variável correspondente.
- **`app/layout.tsx`** — `data-theme="light"` + `suppressHydrationWarning` no `<html>`,
  `<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />` dentro de
  `<head>`, `<body className="min-h-full bg-surface-base">` (hoje `bg-[#FFFDFA]`),
  e o `ThemeProvider` envolvendo `{children}`.
- **`components/app/Configuracoes.tsx`** — `function Mode()` passa a usar
  `useTheme()`; remove o `useState` local e o `PLACEHOLDER`.
- **49 arquivos `.tsx`** com hex → token (ver §7), via `utils/auditar-cores.mjs`.

### 6.3 SVG

`stroke="black"` → `stroke="#433F3F"` em `public/encaracoladoCadastro.svg` (10),
`public/encaracoladoLogin.svg` (8) e `public/encaracoladoRecupera1.svg` (10). Os
outros três `Encaracolado*` já usam `#433F3F`. Esses 28 são **todos** os
`stroke="black"` do diretório — nenhum outro SVG é afetado.

## 7. Regras do refactor

1. **O papel vem da função no contexto, não do hex.** `text-[#FFFDFA]` dentro da
   sidebar vira `text-inverse`; `bg-[#FFFDFA]` na página vira `bg-surface-base`.
   O mesmo hex pode virar tokens diferentes em arquivos diferentes.
2. Todo uso dentro de `bg-surface-inverse` (a sidebar e o `Blurfundo`) que hoje é
   `text-[#FFFDFA]`/`text-[#F0F0F0]` vira `text-inverse`/`text-inverse-muted`.
3. Modificadores de opacidade são preservados: `bg-[#433F3F]/50` →
   `bg-surface-inverse/50`. Tailwind v4 resolve opacidade sobre cor de variável via
   `color-mix()`. São 15 usos com opacidade, e eles não ganham linha própria nas
   tabelas: seguem o token do mesmo site sem o modificador.
4. `text-white` → `text-inverse`. `bg-black/50` → `bg-surface-inverse/50`.
5. Não se cria token novo durante o refactor. Se um caso não couber na paleta, ele é
   mapeado para o token mais próximo e anotado — a paleta é revisada depois, com o
   dark real na mão.
6. Nenhuma classe `dark:` é introduzida.

Ordem sugerida: `app/globals.css` → `utils/theme.ts` → `ThemeProvider` →
`app/layout.tsx` → `Configuracoes.tsx` → demais 48 arquivos.

## 8. Verificação

| Comando | O que garante |
| --- | --- |
| `pnpm lint` | ESLint limpo |
| `npx tsc --noEmit` | tipos OK |
| `pnpm build` | build de produção passa |
| `node utils/auditar-cores.mjs` | imprime `cores hardcoded : 0` e sai com código 0 |
| conferência visual | as rotas `/`, `/login`, `/chat`, `/dashboardAluno` estão idênticas ao estado atual |

Não há framework de teste no projeto (sem script `test` no `package.json`), então a
auditoria de zero hex é o único teste automatizável. O script já existe como
`utils/auditar-cores.mjs`: ele carrega o mapa `(classe hex) -> token`, varre
`app/**/*.tsx` e `components/**/*.tsx`, e falha se sobrar qualquer cor hardcoded.
Hoje ele reporta `cores hardcoded : 353` e `sem mapeamento : 0` — o segundo número
prova que a paleta do §5 cobre todas as ocorrências do código; após o refactor o
primeiro precisa virar `0`.

## 9. Fora de escopo (e por quê)

- **SVGs em geral.** São carregados via `<img src="*.svg">`, e CSS **não** atravessa
  esse limite: não há como um token de cor chegar ao conteúdo do arquivo. Os ~14
  ícones de UI monocromáticos (`engrenagem`, `circulo_conta`, `cadeado`, `seta`,
  `add`, `DeletaIcon`, `EditarIcon`, `globe`, `group_add`, `person_search`, …) e as
  ilustrações de marketing ficam com a cor atual. A única correção é a dos
  `encaracolado*` (§6.3). As alternativas possíveis, quando forem necessárias, são
  converter para componente SVG inline com `currentColor`, ou usar `mask-image` com
  a cor vindo de token — a segunda resolve, mas mascara perde acessibilidade.
- **`prefers-color-scheme`.** Nenhum estado "sistema". O toggle atual tem dois
  botões e o usuário não pediu um terceiro.

## 10. Trabalho futuro

1. Desenhar a paleta escura real: editar **apenas** o bloco `[data-theme="dark"]`.
2. Reavaliar os colapsamentos de §5.4/§5.5 contra o palette novo.
3. Decidir o que fazer com os ícones SVG (§9).
4. Transformar a auditoria de zero hex em script versionado (§8).