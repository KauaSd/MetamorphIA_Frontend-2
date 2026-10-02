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

// script que aplica o tema salvo, injetado no head pelo app/layout
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="dark"||t==="light"){document.documentElement.setAttribute(${JSON.stringify(
  THEME_ATTRIBUTE
)},t)}}catch(e){}})();`;
