"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownProps {
  options: DropDownOption[];
  small?: boolean;
  value?: string;
  values?: string[];
  multiple?: boolean;
  placeholder?: string;
  maxVisibleItems?: number;
  font?: "poppins" | "text-me-one";
  textSize?: string;
  lineHeight?: string;
  itemHeight?: number;
  itemGap?: number;
  onChange?: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
}

export default function DropDown({
  options,
  small = false,
  value,
  values,
  multiple = false,
  placeholder = "Selecione a turma",
  maxVisibleItems,
  font = "text-me-one",
  textSize,
  lineHeight,
  itemHeight,
  itemGap,
  onChange,
  onMultiChange,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [interno, setInterno] = useState(value ?? options[0]?.value ?? "");
  const [internoMulti, setInternoMulti] = useState<string[]>(values ?? []);
  const [scrollProgress, setScrollProgress] = useState(0);

  const selectedValue = value !== undefined ? value : interno;
  const selectedValues = values !== undefined ? values : internoMulti;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);

  const fontClass =
    font === "poppins"
      ? "font-(family-name:--font-poppins)"
      : "font-(family-name:--font-text-me-one)";

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(Math.min(1, Math.max(0, scrollTop / maxScroll)));
    }
  }, []);

  // Permite scrollar com a rodinha do mouse mesmo quando o ponteiro estiver sobre a barra de scroll ou bordas
  const handleWheel = (e: React.WheelEvent) => {
    if (!listRef.current) return;
    listRef.current.scrollTop += e.deltaY;
  };

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        handleScroll();
      });
    }
  }, [isOpen, handleScroll]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const jaExiste = selectedValues.includes(optionValue);
      const novos = jaExiste
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];

      if (values === undefined) {
        setInternoMulti(novos);
      }
      onMultiChange?.(novos);
      onChange?.(novos.join(","));
    } else {
      if (value === undefined) {
        setInterno(optionValue);
      }
      setIsOpen(false);
      onChange?.(optionValue);
    }
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartScrollTopRef.current = listRef.current?.scrollTop ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !listRef.current) return;
      const deltaY = moveEvent.clientY - dragStartYRef.current;
      const { scrollHeight, clientHeight } = listRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const travelDistance = 106 - 77 - 4; // 25px de percurso
      const scrollDelta = (deltaY / travelDistance) * maxScroll;
      listRef.current.scrollTop = dragStartScrollTopRef.current + scrollDelta;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!trackRef.current || !listRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const travelDistance = 106 - 77;
    const ratio = Math.min(1, Math.max(0, (clickY - 77 / 2) / travelDistance));
    const { scrollHeight, clientHeight } = listRef.current;
    listRef.current.scrollTop = ratio * (scrollHeight - clientHeight);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  let labelExibicao = placeholder;
  if (multiple) {
    if (selectedValues.length > 0) {
      const rotulos = options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label);
      if (rotulos.length > 0) {
        labelExibicao = rotulos.join(", ");
      }
    }
  } else {
    labelExibicao = selectedOption?.label || placeholder;
  }

  // Altura fixa de cada item e gap para calcular exatamente a visualização de N itens
  const effectiveItemHeight = itemHeight ?? (small ? 32 : 36);
  const effectiveItemGap = itemGap ?? 4;
  const effectiveTextSize = textSize ?? "text-[18px]";
  const effectiveLineHeight =
    lineHeight ?? (font === "poppins" ? "leading-normal" : "leading-none");

  const maxListHeight = maxVisibleItems
    ? `${maxVisibleItems * effectiveItemHeight + (maxVisibleItems - 1) * effectiveItemGap}px`
    : undefined;

  const temScrollCustomizado =
    Boolean(maxVisibleItems) && options.length > (maxVisibleItems ?? 0);

  return (
    <div
      ref={dropdownRef}
      className={`relative ${small ? "w-36" : "w-full"}`}
    >
      {/* botão principal */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex w-full items-center justify-between
          rounded-full
          bg-sunken hover:bg-sunken-hover
          text-primary ${effectiveTextSize} ${effectiveLineHeight}
          ${fontClass}
          transition-all duration-200 ease-out
          ${small ? "h-8 px-4" : "h-9 px-5"}
        `}
      >
        <span className="truncate py-0.5">
          {labelExibicao}
        </span>

        <ChevronDown
          className={`
            h-5 w-5 shrink-0 ml-2
            transition-transform duration-300 ease-out
            ${isOpen ? "rotate-180" : ""}
          `}
          strokeWidth={2.5}
        />
      </button>

      {/* menu com as opções */}
      <div
        onWheel={handleWheel}
        className={`
          absolute left-0 z-30 w-full
          mt-2 p-1.5
          rounded-3xl
          bg-sunken
          shadow-lg
          origin-top
          overflow-hidden
          transition-all duration-200 ease-out
          ${
            isOpen
              ? "visible translate-y-0 scale-y-100 opacity-100"
              : "invisible -translate-y-1 scale-y-95 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="flex items-center gap-1.5">
          {/* Lista com scroll funcional e barra nativa oculta */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className={`flex-1 flex flex-col ${
              maxVisibleItems
                ? "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                : ""
            }`}
            style={{
              maxHeight: maxListHeight,
              gap: `${effectiveItemGap}px`,
            }}
          >
            {options.map((option) => {
              const selecionada = multiple
                ? selectedValues.includes(option.value)
                : option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  style={{ height: `${effectiveItemHeight}px` }}
                  className={`
                    w-full shrink-0 truncate text-left
                    flex items-center
                    rounded-full
                    text-primary ${effectiveTextSize} ${effectiveLineHeight}
                    ${fontClass}
                    transition-colors duration-150
                    ${small ? "px-2.5" : "px-3"}
                    ${
                      selecionada
                        ? "bg-surface-base"
                        : "bg-transparent hover:bg-surface-base-hover"
                    }
                  `}
                >
                  <span className="truncate py-0.5">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Barra lateral de scroll personalizada: 10x106 com cor da base adaptável (bg-surface-secondary) e thumb (bg-surface-inverse) */}
          {temScrollCustomizado ? (
            <div
              ref={trackRef}
              onClick={handleTrackClick}
              onWheel={handleWheel}
              className="relative w-[10px] h-[106px] shrink-0 rounded-full bg-surface-secondary cursor-pointer my-auto mr-1 select-none"
              title="Rolar opções"
            >
              <div
                onMouseDown={handleThumbMouseDown}
                onWheel={handleWheel}
                className="absolute left-[2px] w-[6px] h-[77px] rounded-full bg-surface-inverse cursor-grab active:cursor-grabbing transition-transform duration-75"
                style={{
                  transform: `translateY(${2 + scrollProgress * (106 - 77 - 4)}px)`,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
