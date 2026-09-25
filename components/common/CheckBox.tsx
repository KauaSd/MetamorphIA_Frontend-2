import Link from "next/link";

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function CheckBox({ checked, onChange }: CheckBoxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        checked={checked}
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <span className="text-xs text-[#797979]">
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
      </span>
    </label>
  );
}