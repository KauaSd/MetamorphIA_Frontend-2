import type { CSSProperties } from "react";

interface EncaracoladoProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

export default function Encaracolado({ src, className, style }: EncaracoladoProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none bg-primary ${className ?? ""}`}
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
    />
  );
}
