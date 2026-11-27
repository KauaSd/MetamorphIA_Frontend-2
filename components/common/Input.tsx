"use client";

import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
};

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  inputRef,
}: InputProps) {
  const isSearch = type === "search";

  return (
    <div className="relative flex items-center w-full">
      {isSearch ? (
        <Search className="absolute left-3.5 w-5 h-5 text-secondary pointer-events-none" />
      ) : null}
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={twMerge(
          "w-full rounded-[70px] py-[0.55rem] text-sm text-secondary outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
          isSearch ? "bg-surface-base pl-12 pr-[0.7rem]" : "bg-sunken px-[0.7rem]",
          className,
        )}
      />
    </div>
  );
}