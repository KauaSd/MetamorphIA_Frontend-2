# Tokens semânticos + modo escuro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar as 353 cores hardcoded por 26 tokens semânticos, e fazer o toggle de tema existente em `Configuracoes.tsx` realmente alternar `data-theme` no `<html>` com persistência e sem flash.

**Architecture:** Tokens CSS como custom properties definidas em `[data-theme="light"]` e `[data-theme="dark"]`, expostas ao Tailwind via `@theme inline`. Um `<script>` inline em `<head>` aplica o tema salvo antes do primeiro paint; o botão de tema em `Configuracoes.tsx` le e escreve o mesmo `localStorage` e reaplica o atributo em `useLayoutEffect`. Nenhum componente escreve classe `dark:` — a inversão acontece só nos valores das variáveis.

**Tech Stack:** Next.js 16.3.0 (App Router), React 19.2.8, Tailwind CSS v4.3.3, TypeScript 5.

**Spec:** `docs/superpowers/specs/2026-09-30-theme-tokens-dark-mode-design.md`

## Global Constraints

- **Não commitar nada.** O usuário pediu explicitamente para não criar commit. Nenhum passo deste plano roda `git commit`, `git add -A` ou similar.
- **Nenhuma classe `dark:` pode ser introduzida** em nenhum arquivo. A inversão de cor acontece exclusivamente nos valores das variáveis CSS.
- **O modo escuro entra com os valores do modo claro**, idênticos. A paleta escura real é trabalho futuro (§10 do spec).
- **`localStorage` apenas, nunca cookie.** Ler cookie no root layout tira o app do prerender estático (`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`, seção "Storing the theme in a cookie").
- **Nenhum token novo durante o refactor.** Todo mapa de 353 ocorrências já está fixado em `utils/cores.mjs`. Se algo não couber, mapeia-se para o token mais próximo e anota-se — não se inventa variável.
- **Não tocar** em `components/app/Menu.tsx`, `components/app/HeaderDashAl.tsx` e `components/app/MenuSection.tsx` além da troca de classes de cor: são trabalho em andamento do usuário, ainda não commitados (`MenuSection.tsx` é untracked).
- **Preservar** em `globals.css` oskeyframes `caret-blink` e `dot`, a classe `.animate-caret-blink` e `--font-sans: var(--font-text-me-one)`.

---

## File Structure

**Já existem e estão verificados** (criados e testados durante o design):

| Arquivo | Responsabilidade |
| --- | --- |
| `utils/cores.mjs` | Fonte única da verdade: `MAPA` (classe hex → token), `ESPECIAIS` (exceções por arquivo), `RE` (regex), `destinoDe()`, `varrer()`. Sem lógica de I/O de escrita. |
| `utils/auditar-cores.mjs` | CLI de leitura. Imprime contagens e sai com código 1 se sobrar cor hardcoded. É o teste de regressão. |
| `utils/traduzir-cores.mjs` | CLI de escrita. Reescreve os `.tsx` aplicando `MAPA`. Aceita `--dry-run`. |

**A criar:**

| Arquivo | Responsabilidade |
| --- | --- |
| `app/globals.css` | Os 26 tokens em `[data-theme="light"]` e `[data-theme="dark"]`, `color-scheme` por seletor, e o mapeamento `@theme inline`. |
| `utils/theme.ts` | Contrato compartilhado entre servidor e cliente: tipo `Theme`, chave de storage, tema padrão, helpers de leitura e corpo do script de arranque. Sem `"use client"`. |

**Não existe (e não deve existir):** nenhum `ThemeProvider`, nenhum Context,
nenhuma classe `dark:`. O único consumidor do tema é `Mode()` em
`components/app/Configuracoes.tsx`, então a lógica mora nele.

**A modificar:** `app/layout.tsx`, `components/app/Configuracoes.tsx`, os 49 arquivos com hex, e 3 SVGs.

---

### Task 1: Verificar as ferramentas de cor

As três ferramentas de `utils/` já estão no disco e foram testadas. Esta task confirma que continuam íntegras antes de qualquer edição.

**Files:**
- Verify: `utils/cores.mjs`, `utils/auditar-cores.mjs`, `utils/traduzir-cores.mjs`

**Interfaces:**
- Consumes: nada.
- Produces: `MAPA`, `ESPECIAIS`, `RE`, `destinoDe(classe, arquivo): string | null`, `varrer(): { arquivos: string[], ocorrencias: { arquivo, classe, destino }[] }`.

- [ ] **Step 1: Confirmar que as 353 ocorrências estão mapeadas**

```bash
cd /home/zenith/Projetos/MetamorphIA_Frontend-Secret
node utils/auditar-cores.mjs
```

Expected output:

```
arquivos varridos : 61
cores hardcoded   : 353
sem mapeamento    : 0
arquivos afetados : 49
```

`sem mapeamento` precisa ser **0**. Se não for, o mapa está incompleto: pare e corrija `MAPA`/`ESPECIAIS` em `utils/cores.mjs` antes de continuar. `cores hardcoded: 353` com código de saída 1 é o estado correto agora — vira 0 depois da Task 6.

- [ ] **Step 2: Confirmar que o codemod cobre tudo sem escrever**

```bash
node utils/traduzir-cores.mjs --dry-run
```

Expected:

```
[dry-run] arquivos alterados: 49
[dry-run] cores traduzidas  : 353
```

- [ ] **Step 3: Confirmar que nada foi escrito no dry-run**

```bash
git status --short
```

Expected: apenas `?? docs/`, `?? utils/cores.mjs`, `?? utils/auditar-cores.mjs`,
`?? utils/traduzir-cores.mjs` e as três modificações que já existiam do usuário
(`CLAUDE.md`, `components/app/HeaderDashAl.tsx`, `components/app/Menu.tsx`).
Nenhum outro arquivo `.tsx` deve aparecer.

---

### Task 2: Os 26 tokens em `app/globals.css`

**Files:**
- Modify: `app/globals.css` (substitui o arquivo inteiro)

**Interfaces:**
- Consumes: nada.
- Produces: as 26 custom properties abaixo + `color-scheme`, consumidas pelas utilities Tailwind `bg-*`, `text-*`, `border-*`, `divide-*` via `@theme inline`.

- [ ] **Step 1: Substituir `app/globals.css` pelo conteúdo abaixo**

```css
@import "tailwindcss";

/* ------------------------------------------------------------------
   Tokens
   O bloco [data-theme="dark"] e, de proposito, identico ao light.
   A paleta escura real e trabalho futuro: para desenha-la, basta
   editar os valores do bloco dark. Nenhum componente precisa mudar.
   ------------------------------------------------------------------ */

[data-theme="light"] {
  color-scheme: light;

  /* fundo da pagina */
  --surface-base: #fffdfa;
  --surface-base-hover: #cac7c2;
  /* baloes, cards */
  --surface-raised: #faf8f5;
  /* chips, popovers */
  --surface-overlay: #ffffff;
  --surface-overlay-hover: #ebebeb;
  /* painel escuro */
  --surface-inverse-hover: #4c4c4c;
  /* superficie inversa translucida */
  --surface-accent: #d4c7f8;
  --surface-accent-strong: #ab97e0;
  --surface-danger: #ff9999;
  --surface-danger-strong: #ff5154;
  --surface-warning: #ffd279;
  --surface-success: #ceffca;
  --surface-info: #caf3ff;
  --surface-positive: #c9f9fe;
  --surface-tag-other: #948f9e;
  /* texto principal */
  --primary: #433f3f;
  /* texto secundario, borda forte, selecionado */
  --secondary: #797979;
  --muted: #f0f0f0;
  /* hover, borda padrao */
  --sunken: #d9d9d9;
  --sunken-hover: #c0c0c0;
  --tertiary: #555555;
  --accent: #c5b4ff;
  --danger: #ff8a8a;
  --warning: #ffc164;
  /* texto sobre superficie escura */
  --inverse: #fffdfa;
  --inverse-muted: #f0f0f0;
}

[data-theme="dark"] {
  color-scheme: dark;

  /* fundo da pagina */
  --surface-base: #fffdfa;
  --surface-base-hover: #cac7c2;
  /* baloes, cards */
  --surface-raised: #faf8f5;
  /* chips, popovers */
  --surface-overlay: #ffffff;
  --surface-overlay-hover: #ebebeb;
  /* painel escuro */
  --surface-inverse-hover: #4c4c4c;
  /* superficie inversa translucida */
  --surface-accent: #d4c7f8;
  --surface-accent-strong: #ab97e0;
  --surface-danger: #ff9999;
  --surface-danger-strong: #ff5154;
  --surface-warning: #ffd279;
  --surface-success: #ceffca;
  --surface-info: #caf3ff;
  --surface-positive: #c9f9fe;
  --surface-tag-other: #948f9e;
  /* texto principal */
  --primary: #433f3f;
  /* texto secundario, borda forte, selecionado */
  --secondary: #797979;
  --muted: #f0f0f0;
  /* hover, borda padrao */
  --sunken: #d9d9d9;
  --sunken-hover: #c0c0c0;
  --tertiary: #555555;
  --accent: #c5b4ff;
  --danger: #ff8a8a;
  --warning: #ffc164;
  /* texto sobre superficie escura */
  --inverse: #fffdfa;
  --inverse-muted: #f0f0f0;
}

@keyframes caret-blink {
  0%, 70%, 100% { opacity: 0; }
  20%, 50% { opacity: 1; }
}

@keyframes dot {
  0%, 60%, 100% {
    opacity: 0.25;
  }

  30% {
    opacity: 1;
  }
}

.animate-caret-blink {
  animation: caret-blink 1s steps(1) infinite;
}

@theme inline {
  --color-surface-base: var(--surface-base);
  --color-surface-base-hover: var(--surface-base-hover);
  --color-surface-raised: var(--surface-raised);
  --color-surface-overlay: var(--surface-overlay);
  --color-surface-overlay-hover: var(--surface-overlay-hover);
  --color-surface-inverse-hover: var(--surface-inverse-hover);
  --color-surface-accent: var(--surface-accent);
  --color-surface-accent-strong: var(--surface-accent-strong);
  --color-surface-danger: var(--surface-danger);
  --color-surface-danger-strong: var(--surface-danger-strong);
  --color-surface-warning: var(--surface-warning);
  --color-surface-success: var(--surface-success);
  --color-surface-info: var(--surface-info);
  --color-surface-positive: var(--surface-positive);
  --color-surface-tag-other: var(--surface-tag-other);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-sunken: var(--sunken);
  --color-sunken-hover: var(--sunken-hover);
  --color-tertiary: var(--tertiary);
  --color-accent: var(--accent);
  --color-danger: var(--danger);
  --color-warning: var(--warning);
  --color-inverse: var(--inverse);
  --color-inverse-muted: var(--inverse-muted);

  --font-sans: var(--font-text-me-one);
}

body {
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: Arial, Helvetica, sans-serif;
}
```

`@theme inline` é obrigatório, e não `@theme`: sem `inline` o Tailwind resolve o
valor da variável em build e o `data-theme` deixa de funcionar em runtime.

- [ ] **Step 2: Confirmar que as duas custom properties antigas saíram**

```bash
rg -n '\-\-background|\-\-foreground' app/globals.css
```

Expected: **nenhuma ocorrência**. `--background` e `--foreground` foram
substituídos por `--surface-base` e `--text-primary`. (Buscar só pelo prefixo
`--`; a regra `body { background: ... }` é legítima e não deve ser confundida
com o custom property antigo.)

- [ ] **Step 3: Build para confirmar que o CSS compila**

```bash
pnpm build
```

Expected: build passa. Ele vai passar mesmo antes da Task 6, porque
`@theme inline` só gera as utilities que forem usadas.

---

### Task 3: Sem provider — lógica dentro do próprio toggle

**Files:**
- Create: `utils/theme.ts` (constantes + helpers compartilhados, sem `"use client"`)
- Modify: `components/app/Configuracoes.tsx` (`Mode()`)

**Interfaces:**
- Consumes: nada.
- Produces: `Theme`, `THEME_STORAGE_KEY`, `DEFAULT_THEME`, `THEME_ATTRIBUTE`, `isTheme()`, `lerTemaSalvo()`, `THEME_INIT_SCRIPT` — consumidos pela Task 5 (script) e pela Task 3 (toggle).

- [ ] **Step 1: Criar `utils/theme.ts`**

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "tema";

export const DEFAULT_THEME: Theme = "light";

export const THEME_ATTRIBUTE = "data-theme";

export function isTheme(valor: unknown): valor is Theme {
  return valor === "dark" || valor === "light";
}

export function lerTemaSalvo(): Theme {
  try {
    const salvo = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(salvo) ? salvo : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// Roda durante o parsing do HTML, antes do primeiro paint, para nao haver
// flash do tema errado. O try/catch cobre localStorage bloqueado.
// A chave e interpolada na build para o script e o componente nunca divergirem.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="dark"||t==="light"){document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE
)},t)}}catch(e){}})();`;
```

- [ ] **Step 2: `Mode()` autossuficiente em `Configuracoes.tsx`**

```tsx
function Mode() {
  // O inicializador le o mesmo localStorage que o script inline do <head>,
  // entao o primeiro render do React bate com o DOM e nao ha hydration
  // mismatch. No servidor cai no tema padrao.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? DEFAULT_THEME : lerTemaSalvo()
  );

  // Reaplica o atributo depois do remount do StrictMode em dev, que limpa os
  // atributos de <html> e apaga o que o script gravou. No-op em producao.
  useLayoutEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  function trocar(proximo: Theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, proximo);
    } catch {
      // Sem storage o tema ainda funciona na sessao corrente.
    }
    setTheme(proximo);
  }

  return (/* os dois botões, ver Task 6 */);
}
```

**Por que não existe um `ThemeProvider` com Context.** Havia uma versão com
`ThemeProvider` + `useTheme()`, e ela era over-engineering: `useTheme()` tinha
**um único consumidor** (`Mode()`), enquanto o provider envolvia o app inteiro.
O exemplo oficial da doc (`theme-toggle.tsx`) **não usa Context nenhum** — é um
componente com `useLayoutEffect` lendo `localStorage` direto. Segui a doc.

Duas afirmações da doc que contrariavam o raciocínio inicial e valem registrar:

- `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md:480`:
  *"The inline script and the lazy `useState` initializer both read from
  `localStorage`. They always agree, so React's initial state matches the DOM."*
  O lazy initializer **não** causa hydration mismatch: o React compara o render
  do cliente com o DOM ao vivo, e o script inline já aplicou o mesmo valor.
- Mesma doc, linha 484: o remount do StrictMode em dev limpa `<html>`; a
  correção prescrita é exatamente o `useLayoutEffect` acima, e é no-op em
  produção.

Uma versão intermediária com `useSyncExternalStore` foi descartada por
introduzir cache de módulo, evento customizado e `getServerSnapshot` para
resolver um problema que a doc mostra que não existe.

- [ ] **Step 3: Lint e typecheck**

```bash
npx eslint components/app/Configuracoes.tsx utils/theme.ts
npx tsc --noEmit
```

Expected: os dois passam. O lint é a verificação crítica: `setState`
síncrono dentro de efeito dispara `react-hooks/set-state-in-effect`. O código
acima evita isso porque o `useLayoutEffect` só escreve no DOM (sistema externo),
nunca em estado do React.

### Task 4: `app/layout.tsx` — atributo e script

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `THEME_INIT_SCRIPT` de `utils/theme.ts` (Task 3).
- Produces: `<html data-theme="light" suppressHydrationWarning>` e o atributo aplicado antes do paint. Nenhuma task downstream consome isso diretamente.

- [ ] **Step 1: Trocar o import de `Metadata` e adicionar os novos**

Em `app/layout.tsx`, substitua a primeira linha:

```tsx
import type { Metadata } from "next";
```

por:

```tsx
import type { Metadata } from "next";
import { THEME_INIT_SCRIPT } from "@/utils/theme";
```

`THEME_ATTRIBUTE` não é importado aqui: o nome do atributo em JSX precisa ser
estático, então `data-theme="light"` fica escrito à mão.

- [ ] **Step 2: Trocar o componente `RootLayout`**

Substitua de `export default function RootLayout({` até o `}` final do arquivo
(hoje linhas 22-35) por:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${TextMeOne.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-surface-base">{children}</body>
    </html>
  );
}
```

Três detalhes que não podem faltar:

- `suppressHydrationWarning` no `<html>`: o script inline altera o atributo
  antes de o React hidratar; sem isso o React trata como mismatch e recria a
  árvore.
- O `<script>` fica em `<head>`, não no fim do `<body>`: precisa executar durante
  o parsing.
- `bg-surface-base` no `<body>` substitui o `bg-[#FFFDFA]`, para que o corpo
  também siga o tema.

O `metadata` export e os imports de fonte ficam intactos.

- [ ] **Step 3: Build**

```bash
pnpm build
```

Expected: passa.

---

### Task 5: Ligar o toggle em `Configuracoes.tsx`

**Files:**
- Modify: `components/app/Configuracoes.tsx:1-12` (imports), `components/app/Configuracoes.tsx:265-303` (`function Mode()`)

**Interfaces:**
- Consumes: `THEME_ATTRIBUTE`, `THEME_STORAGE_KEY`, `isTheme`, `lerTemaSalvo`, `Theme` de `utils/theme.ts` (Task 3).
- Produces: nada para consumo posterior.

> Esta task só escreve o JSX dos dois botões. A lógica de estado, o
> `useLayoutEffect` e a persistência já vêm prontos da Task 3.

- [ ] **Step 1: Adicionar os imports**

Em `components/app/Configuracoes.tsx`, troque as duas primeiras linhas de import:

```tsx
import { ReactNode, useLayoutEffect, useState } from "react";
```

e acrescente junto dos demais:

```tsx
import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  lerTemaSalvo,
  type Theme,
} from "@/utils/theme";
```

`useLayoutEffect` precisa entrar no import do React. O arquivo já começa com
`"use client"`.

- [ ] **Step 2: Trocar `function Mode()`**

Substitua o corpo inteiro de `Mode()` (hoje linhas 265-303) por:

```tsx
function Mode() {
  // A lógica de estado, persistencia e reaplicacao do atributo ja vem da
  // Task 3. Aqui so o JSX dos dois botoes.
  return (
    <div className="flex items-center gap-2">
      {/* MODO CLARO */}
      <button
        type="button"
        aria-label="Modo claro"
        aria-pressed={theme === "light"}
        onClick={() => trocar("light")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          theme === "light"
            ? "bg-surface-warning"
            : "hover:bg-surface-sunken"
        }`}
      >
        <Sun className="h-5 w-5 text-primary" />
      </button>

      {/* MODO ESCURO */}
      <button
        type="button"
        aria-label="Modo escuro"
        aria-pressed={theme === "dark"}
        onClick={() => trocar("dark")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          theme === "dark"
            ? "bg-surface-accent"
            : "hover:bg-surface-sunken"
        }`}
      >
        <Moon className="h-5 w-5 text-primary" />
      </button>
    </div>
  );
}
```

O `useState<"light" | "dark">("light")` e o `// PLACEHOLDER` saem junto. O
`bg-[#FFD279]` vira `bg-surface-warning`, `bg-[#D4C7F8]` vira
`bg-surface-accent`, `hover:bg-[#D9D9D9]` vira `hover:bg-surface-sunken` e
`text-[#433F3F]` vira `text-primary`. O `aria-pressed` foi adicionado porque o
botão agora é um toggle real e precisa anunciar o estado.

- [ ] **Step 3: Lint e typecheck do arquivo**

```bash
npx eslint components/app/Configuracoes.tsx && npx tsc --noEmit
```

Expected: passa. `useState` continua em uso em outros pontos do arquivo
(`abaAtiva`, `mostrarFormDeleta`, `mostrarFormDesconecta`), então o import
precisa continuar com `ReactNode, useLayoutEffect, useState` — remover
`useState` quebra o typecheck em 3 linhas.

---

### Task 6: Traduzir as 353 cores

**Files:**
- Modify: 49 arquivos `.tsx` (a lista completa sai de `node utils/auditar-cores.mjs --detalhe`)

**Interfaces:**
- Consumes: `MAPA`, `ESPECIAIS`, `RE`, `destinoDe()` de `utils/cores.mjs` (Task 1); os 26 tokens da Task 2.
- Produces: zero cor hardcoded em `.tsx`.

- [ ] **Step 1: Tirar um snapshot dos 49 arquivos**

```bash
mkdir -p /tmp/opencode/antes
cd /home/zenith/Projetos/MetamorphIA_Frontend-Secret
for f in $(node -e "import('./utils/cores.mjs').then(m=>{const r=m.varrer();console.log([...new Set(r.ocorrencias.map(o=>o.arquivo))].join(' '))})"); do
  mkdir -p "/tmp/opencode/antes/$(dirname "$f")"
  cp "$f" "/tmp/opencode/antes/$f"
done
find /tmp/opencode/antes -name '*.tsx' | wc -l
```

Expected: `49`. O snapshot é obrigatório: `Menu.tsx` e `HeaderDashAl.tsx` já
têm mudanças não commitadas do usuário, então `git diff` sozinho não isola o que
o codemod mudou.

- [ ] **Step 2: Rodar o codemod**

```bash
node utils/traduzir-cores.mjs
```

Expected:

```
arquivos alterados: 49
cores traduzidas  : 353
```

- [ ] **Step 3: Confirmar que a auditoria zera**

```bash
node utils/auditar-cores.mjs
```

Expected:

```
arquivos varridos : 61
cores hardcoded   : 0
sem mapeamento    : 0
arquivos afetados : 0
```

E código de saída 0. Este é o critério de aceite do refactor inteiro.

- [ ] **Step 4: Revisar as 3 exceções por arquivo**

O codemod decidiu por contexto de arquivo; confira que acertou:

```bash
rg -n 'bg-secondary' components/common/CheckBoxAl.tsx
rg -n 'bg-surface-neutral' 'app/(public)/page.tsx'
rg -n 'bg-line-strong' components/app/HeaderDashAl.tsx
```

Expected: 1 ocorrência em `CheckBoxAl.tsx` (a linha 21, `checked ? ... : ...`),
3 ocorrências em `app/(public)/page.tsx` (linhas 252, 281, 310 — as barras do
accordion) e 2 em `HeaderDashAl.tsx` (linhas 8 e 10 — as réguas `h-px`).

Depois da consolidação dos tokens (Task 2), `#797979` colapsa em um único token
`--secondary`: os quatro papeis especiais que tinham antes (`--surface-neutral`,
`--text-secondary`, `--line-strong`, `--control-selected`) viram
`bg-secondary`, `text-secondary`, `border-secondary`. O `ESPECIAIS` por arquivo
deixou de ser necessário — o valor é o mesmo nos quatro papéis.

- [ ] **Step 5: Conferir que nenhuma lógica mudou, só classes**

```bash
diff -r /tmp/opencode/antes app components 2>/dev/null | grep -E '^[<>]' | grep -vE 'className|^\s*[<>]\s*.*(bg-|text-|border-|divide-|from-|to-|caret-)' | head -30
```

Expected: **nenhuma saída**. Se algo aparecer, o codemod alterou algo além de
classes de cor — reverta aquele arquivo com
`cp /tmp/opencode/antes/<arquivo> <arquivo>` e conserte à mão.

- [ ] **Step 6: Conferir os três arquivos de WIP do usuário**

`Menu.tsx`, `HeaderDashAl.tsx` e `MenuSection.tsx` estavam sendo editados. O diff
deles contra o snapshot deve conter apenas classes de cor:

```bash
diff /tmp/opencode/antes/components/app/Menu.tsx components/app/Menu.tsx | grep -cE '^[<>]'
diff /tmp/opencode/antes/components/app/MenuSection.tsx components/app/MenuSection.tsx | grep -cE '^[<>]'
```

Expected: contagens pequenas (iguais ao número de cores nesses arquivos: 5 em
`Menu.tsx`, 5 em `MenuSection.tsx`, 7 em `HeaderDashAl.tsx`).

- [ ] **Step 7: Lint e build**

```bash
pnpm lint && pnpm build
```

Expected: ambos passam. O build é a prova de que toda utility nova gerada pelo
`@theme inline` existe de fato.

---

### Task 7: Cor dos `encaracolado`

**Files:**
- Modify: `public/encaracoladoCadastro.svg` (10 ocorrências)
- Modify: `public/encaracoladoLogin.svg` (8 ocorrências)
- Modify: `public/encaracoladoRecupera1.svg` (10 ocorrências)

**Interfaces:**
- Consumes: nada.
- Produces: nada para consumo de código.

- [ ] **Step 1: Trocar `stroke="black"` por `stroke="#433F3F"` nos três arquivos**

```bash
cd /home/zenith/Projetos/MetamorphIA_Frontend-Secret
sed -i 's/stroke="black"/stroke="#433F3F"/g' \
  public/encaracoladoCadastro.svg \
  public/encaracoladoLogin.svg \
  public/encaracoladoRecupera1.svg
```

São 28 substituições. Os outros três `Encaracolado*` já usam `#433F3F` e não são
tocados. Nenhum outro SVG do repositório tem `stroke="black"`.

- [ ] **Step 2: Confirmar que nenhum `black` sobrou**

```bash
rg -n 'stroke="black"' public/
```

Expected: nenhuma saída.

- [ ] **Step 3: Confirmar que só os três arquivos mudaram**

```bash
git status --short public/
```

Expected: exatamente três linhas `M`, uma por arquivo.

---

### Task 8: Verificação final

**Files:**
- Verify: tudo

**Interfaces:**
- Consumes: as Tasks 1-8.
- Produces: confiança de que a etapa está completa e visualmente neutra.

- [ ] **Step 1: Auditoria de cor**

```bash
node utils/auditar-cores.mjs; echo "exit=$?"
```

Expected: `cores hardcoded : 0` e `exit=0`.

- [ ] **Step 2: Lint, typecheck e build**

```bash
pnpm lint && npx tsc --noEmit && pnpm build
```

Expected: os três passam.

- [ ] **Step 3: Confirmar que nenhuma classe `dark:` foi introduzida**

```bash
rg -n 'dark:' app components
```

Expected: nenhuma ocorrência. Se aparecer, é violação da restrição global.

- [ ] **Step 4: Conferir que nenhum hex sobrou em lugar nenhum**

```bash
rg -n '#[0-9A-Fa-f]{6}' app components --glob '*.tsx'
```

Expected: nenhuma ocorrência. Cores que sobraram em `.css` ou `.svg` são
esperadas e desejadas (tokens e os três encaracolado).

- [ ] **Step 5: Conferir visualmente que nada mudou**

```bash
pnpm dev
```

Abra, sem alterar nada, e compare com o estado anterior:

- `/` — landing page, FAQ, planos
- `/login` e `/cadastro` — forms, checkbox, checkbox de aluno
- `/chat` — sidebar, balões, input
- Configurações → aba Geral → Preferências → Aparência: clicar em cada um dos
  dois botões. **A tela não deve mudar de cor** — este é o resultado esperado,
  porque o dark tem a paleta do light por decisão do usuário. O que precisa
  funcionar é: o botão ativo muda de destaque, o atributo `data-theme` no
  `<html>` muda (veja no DevTools), e o tema persiste ao recarregar (F5).
- Recarregar a página com o dark ativo: **não pode piscar** para o light. Se
  piscar, o `<script>` não está no `<head>` ou o `suppressHydrationWarning`
  falta no `<html>`.

- [ ] **Step 6: Conferir o atributo no DevTools**

Expected: `<html data-theme="dark">` ao clicar no botão de lua, e o valor
correspondente em `localStorage["tema"]`.

- [ ] **Step 7: Confirmar que nada foi commitado**

```bash
git log --oneline -1
git status --short
```

Expected: `HEAD` continua em `ad92eb2` (o merge que já existia) e o `git status`
mostra as modificações não commitadas.