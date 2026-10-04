"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface DropDownProps {
  options: Option[];
  small?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function DropDown({
  options,
  small = false,
  value,
  placeholder = "Selecione a turma",
  onChange,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [interno, setInterno] = useState(value ?? options[0]?.value ?? "");

  const selectedValue = value !== undefined ? value : interno;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (value === undefined) {
      setInterno(optionValue);
    }
    setIsOpen(false);
    onChange?.(optionValue);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div
      ref={dropdownRef}
      className={`relative ${small ? "w-36" : "w-full"}`}
    >
      {/* botão */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex w-full items-center justify-between
          rounded-full
          bg-sunken
          text-primary text-[18px] leading-none
          font-(family-name:--font-text-me-one)
          transition-all duration-200 ease-out
          ${small ? "h-8 px-4" : "h-9 px-5"}
        `}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
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

      {/* opções */}
      <div
        className={`
          absolute left-0 z-10 w-full
          mt-2 p-1.5
          rounded-3xl
          bg-sunken
          shadow-lg
          origin-top
          transition-all duration-200 ease-out
          ${
            isOpen
              ? "visible translate-y-0 scale-y-100 opacity-100"
              : "invisible -translate-y-1 scale-y-95 opacity-0"
          }
        `}
      >
        <div className="flex flex-col gap-0.5">
          {options.map((option) => {
            const selecionada = option.value === selectedValue;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full truncate text-left
                  rounded-full
                  text-primary text-[18px] leading-none
                  font-(family-name:--font-text-me-one)
                  transition-colors duration-150
                  ${small ? "px-2.5 py-1.5" : "px-3 py-2"}
                  ${
                    selecionada
                      ? "bg-surface-base"
                      : "bg-transparent hover:bg-surface-base-strong"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}