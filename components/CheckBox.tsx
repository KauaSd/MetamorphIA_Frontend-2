"use client";

import { useState } from "react";

export default function CheckBox() {
  const [aceitaTermos, setAceitaTermos] = useState(false);

  return (
    <label className="flex cursor-pointer items-start gap-2">
      <input
        type="checkbox"
        onChange={(e) => setAceitaTermos(e.target.checked)}
        checked={aceitaTermos}
        className="mt-0.5 h-5 w-5 shrink-0"
      />
      <span className="text-xs text-[#797979]">
        Declaro que li os <u><b>Termos de Serviço</b></u> e <u><b>Privacidade</b></u>
      </span>
    </label>
  );
}