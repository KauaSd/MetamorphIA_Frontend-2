export default function PlanosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh w-full items-start justify-center overflow-y-auto bg-surface-muted text-primary lg:h-dvh lg:items-center lg:overflow-hidden">
      {children}
    </div>
  );
}
