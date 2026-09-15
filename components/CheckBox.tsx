"use client";

import Link from "next/dist/client/link";
import { useState } from "react";

export default function CheckBox() {
  const [aceitaTermos, setAceitaTermos] = useState(false);

  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        onChange={(e) => setAceitaTermos(e.target.checked)}
        checked={aceitaTermos}
        className="mt-0.5 ml-2 h-4 w-4 shrink-0 appearance-none rounded-sm border border-[#797979] checked:bg-[#797979] user-invalid:border-red-500"
      />
      <span className="text-xs text-[#797979]">
          <p className="flex gap-1">
            Declaro que li os <Link href="/uso">
            <p className="cursor-pointer">
              <u><b>Termos de Uso</b></u>
            </p>
          </Link> e <Link href="/privacidade">
            <p className="cursor-pointer">
              <u><b>Privacidade</b></u>
            </p>
          </Link>
          </p>
        </span>
    </label>
  );
}