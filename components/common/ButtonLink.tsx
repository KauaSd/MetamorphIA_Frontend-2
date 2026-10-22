import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { ButtonVariant } from "./Button";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default:
    "bg-surface-accent text-ink hover:bg-surface-accent-strong",
  inverse:
    "bg-surface-inverse text-inverse hover:bg-surface-inverse-hover",
  danger:
    "bg-surface-danger text-ink hover:bg-surface-danger/80",
  warning:
    "bg-surface-warning text-ink hover:bg-surface-warning-strong",
  sunken:
    "bg-sunken text-primary hover:bg-sunken-hover",
  outline:
    "bg-surface-base border border-surface-accent text-surface-accent hover:bg-surface-accent hover:text-ink",
  base:
    "bg-surface-base text-primary hover:bg-surface-base-hover",
};

function inferVariant(className?: string): ButtonVariant {
  if (!className) return "default";
  if (className.includes("bg-surface-danger")) return "danger";
  if (className.includes("bg-surface-inverse")) return "inverse";
  if (
    className.includes("bg-surface-warning") ||
    className.includes("bg-[#FEDA7A]") ||
    className.includes("bg-[#FFD279]")
  )
    return "warning";
  if (className.includes("bg-sunken") || className.includes("bg-[#D9D9D9]"))
    return "sunken";
  if (
    className.includes("bg-surface-base") &&
    className.includes("border-surface-accent")
  )
    return "outline";
  if (className.includes("bg-surface-base")) return "base";
  return "default";
}

export interface ButtonLinkProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
}

export default function ButtonLink({
  href,
  onClick,
  className,
  variant,
  children,
}: ButtonLinkProps) {
  const resolvedVariant = variant ?? inferVariant(className);
  const variantClasses = VARIANT_STYLES[resolvedVariant];

  const classes = twMerge(
    "inline-flex w-full items-center justify-center rounded-[70px] px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base cursor-pointer transition-colors",
    variantClasses,
    className,
  );

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
