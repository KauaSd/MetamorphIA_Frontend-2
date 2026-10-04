"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import TagAluno from "@/components/common/TagAluno";

interface MenuSectionItem {
  nome: string;
  href: string;
  /** neurodivergencias que viram as fatias da bolinha */
  neuros: string[];
  /** quando vem, a bolinha usa esta cor no lugar do gradiente */
  cor?: string;
}

// evita que o hover abra o dropdown em telas de toque
function canHover() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches
  );
}

interface MenuSectionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  items: MenuSectionItem[];
  isOpen: boolean;
  isSidebarOpen: boolean;
  onToggle: () => void;
  /** antes dos dados chegarem a linha nao navega, so espera */
  carregando?: boolean;
}

export default function MenuSection({
  id,
  label,
  icon,
  href,
  items,
  isOpen,
  isSidebarOpen,
  onToggle,
  carregando = false,
}: MenuSectionProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

  const hasItems = items && items.length > 0;
  // abre pelo clique ou pelo hover, usado pelo Menu - apenas se tiver itens
  const expanded = hasItems && (isOpen || isHovered) && isSidebarOpen;

  const rowClass = `relative h-[35px] flex items-center cursor-pointer select-none disabled:cursor-default ${
    isSidebarOpen
      ? hasItems ? "w-full justify-between" : "w-full justify-start"
      : "w-[30px] justify-center mx-auto"
  } before:absolute before:inset-y-0 before:-inset-x-2.5 before:rounded-[70px] before:transition-colors before:duration-200 hover:before:bg-surface-inverse-hover ${
    expanded ? "before:bg-surface-inverse-hover" : "before:bg-transparent"
  }`;

  const rowContent = (
    <>
      <div className="relative z-10 flex items-center gap-4 min-w-0">
        {icon}

        <p
          className={`text-inverse-muted text-xl ${
            !isSidebarOpen && "hidden"
          }`}
        >
          {label}
          </p>
        </div>

        {hasItems && (
          <ChevronDown
            className={`relative z-10 w-7.5 h-7.5 text-inverse shrink-0 transition-transform duration-200 ${
              !isSidebarOpen && "hidden"
            } ${expanded ? "rotate-180" : "rotate-0"}`}
          />
        )}

        {carregando && (
          <span
            aria-hidden
            className={`h-4 w-10 shrink-0 rounded-[70px] bg-surface-inverse-hover ${!isSidebarOpen && "hidden"}`}
          />
        )}
    </>
  );

  return (
    <div
      className="flex flex-col w-full min-w-0"
      onMouseEnter={() => {
        if (canHover() && hasItems) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label={label}
          aria-expanded={expanded}
          aria-controls={`${id}-dropdown`}
          aria-busy={carregando || undefined}
          disabled={carregando}
          onClick={hasItems ? onToggle : () => router.push(href)}
          className={rowClass}
        >
          {rowContent}
        </button>
      ) : (
        <Link href={href} aria-label={label} className={rowClass}>
          {rowContent}
        </Link>
      )}

      {/* lista que abre e fecha - só aparece se tiver itens */}
      {hasItems && (
        <div
          id={`${id}-dropdown`}
          className={`grid w-full min-w-0 transition-all duration-200 ease-in-out ${
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden w-full min-w-0">
            <div className="flex flex-col gap-0.5 mt-3 min-w-0">
              {items.map((item, index) => (
                <Link
                  key={`${id}-item-${index}`}
                  href={item.href}
                  className="flex items-center min-w-0 px-2 py-0.5 rounded-[30px] transition-colors hover:bg-surface-inverse-hover"
                >
                  <TagAluno nome={item.nome} neuros={item.neuros} ismenu cor={item.cor} />
                </Link>
              ))}

              <Link
                href={href}
                className="mx-auto mt-3 flex items-center justify-center w-[117px] h-[27px] text-[14px] rounded-[70px] whitespace-nowrap transition-colors bg-surface-inverse-hover text-inverse hover:bg-surface-inverse-hover"
              >
                Ver todos...
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
