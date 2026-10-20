import type { CSSProperties } from "react";

interface EncaracoladoProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

const ESTILO_MASCARA_BASE: CSSProperties = {
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
};

export default function Encaracolado({ src, className, style }: EncaracoladoProps) {
  const maskImage = `url(${src})`;

  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none bg-primary ${className ?? ""}`}
      style={{
        ...ESTILO_MASCARA_BASE,
        WebkitMaskImage: maskImage,
        maskImage,
        ...style,
      }}
    />
  );
}
