export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-surface-muted text-primary max-lg:h-auto max-lg:min-h-dvh max-lg:items-start max-lg:overflow-y-auto">
      {children}
    </div>
  );
}
