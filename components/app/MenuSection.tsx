"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import TagAluno from "@/components/common/TagAluno";

interface MenuSectionItem {
  tag: string;
  nome: string;
  href: string;
}

// Evita que um toque em telas sensíveis ao toque "grude" o dropdown aberto
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
}: MenuSectionProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // O hover só abre; a seção clicada continua aberta quando o mouse sai
  const expanded = (isOpen || isHovered) && isSidebarOpen;

  const rowClass = `relative h-[35px] flex items-center cursor-pointer select-none ${
    isSidebarOpen
      ? "w-full justify-between"
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

        <ChevronDown
          className={`relative z-10 w-7.5 h-7.5 text-inverse shrink-0 transition-transform duration-200 ${
            !isSidebarOpen && "hidden"
          } ${expanded ? "rotate-180" : "rotate-0"}`}
        />
    </>
  );

  return (
    <div
      className="flex flex-col w-full min-w-0"
      onMouseEnter={() => {
        if (canHover()) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label={label}
          aria-expanded={expanded}
          aria-controls={`${id}-dropdown`}
          onClick={onToggle}
          className={rowClass}
        >
          {rowContent}
        </button>
      ) : (
        <Link href={href} aria-label={label} className={rowClass}>
          {rowContent}
        </Link>
      )}

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
                <TagAluno label={item.tag} nome={item.nome} ismenu />
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
    </div>
  );
}
