export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-surface-muted text-primary">
      {children}
    </div>
  );
}
