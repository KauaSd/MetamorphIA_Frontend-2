"use client";

import { Search } from "lucide-react";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  const isSearch = type === "search";

  return (
    <div className="relative flex items-center w-full">
      {isSearch && (
        <Search className="absolute left-3.5 w-5 h-5 text-[#797979] pointer-events-none" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-[70px] py-[0.55rem] text-sm text-[#797979] outline-none transition-colors ${
          isSearch 
            ? "bg-[#FFFDFA] pl-12 pr-[0.7rem]" 
            : "bg-[#D9D9D9] px-[0.7rem]"
        }`}
      />
    </div>
  );
}