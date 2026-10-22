import { twMerge } from "tailwind-merge";

export type ButtonVariant =
  | "default"
  | "inverse"
  | "danger"
  | "warning"
  | "sunken"
  | "outline"
  | "base";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default:
    "bg-surface-accent text-ink hover:bg-surface-accent-strong disabled:hover:bg-surface-accent",
  inverse:
    "bg-surface-inverse text-inverse hover:bg-surface-inverse-hover disabled:hover:bg-surface-inverse",
  danger:
    "bg-surface-danger text-ink hover:bg-surface-danger/80 disabled:hover:bg-surface-danger",
  warning:
    "bg-surface-warning text-ink hover:bg-surface-warning-strong disabled:hover:bg-surface-warning",
  sunken:
    "bg-sunken text-primary hover:bg-sunken-hover disabled:hover:bg-sunken",
  outline:
    "bg-surface-base border border-surface-accent text-surface-accent hover:bg-surface-accent hover:text-ink disabled:hover:bg-surface-base",
  base:
    "bg-surface-base text-primary hover:bg-surface-base-hover disabled:hover:bg-surface-base",
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  variant?: ButtonVariant;
};

export default function Button({ 
  children,
  type = "button",
  variant,
  className,
  ...props
}: ButtonProps){
  const resolvedVariant = variant ?? inferVariant(className);
  const variantClasses = VARIANT_STYLES[resolvedVariant];

  return(
    <button 
      type={type}
      className={twMerge(
        "w-full rounded-[70px] px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses,
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}
