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
  onChange?: (value: string) => void;
}

export default function DropDown({ options, small = false, value, onChange }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? options[0]?.value ?? "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  const selectedOption = options.find((option) => option.value === selectedValue);

  return (
    <div ref={dropdownRef} className={`relative ${small ? "w-32" : "w-50"}`}>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-full px-4 text-sm ${
          small ? "h-8" : "h-10"
        } bg-surface-base text-primary`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || options[0]?.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-2xl bg-surface-base shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`w-full px-4 py-2 text-left text-sm text-primary first:rounded-t-2xl last:rounded-b-2xl hover:bg-surface-base-strong ${
                option.value === selectedValue ? "bg-surface-base-strong" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
