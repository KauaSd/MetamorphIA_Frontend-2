import Link from "next/link";
import { Check } from "lucide-react";

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

export default function CheckBox({ checked, onChange, children }: CheckBoxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors ${
          checked
            ? "border-secondary bg-secondary text-surface-base"
            : "border-secondary bg-transparent"
        }`}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="text-xs text-secondary">
        {children ?? (
          <>
            Declaro que li os{" "}
            <Link href="/uso">
              <u>
                <b>Termos de Uso</b>
              </u>
            </Link>{" "}
            e{" "}
            <Link href="/privacidade">
              <u>
                <b>Privacidade</b>
              </u>
            </Link>
          </>
        )}
      </span>
    </label>
  );
}
