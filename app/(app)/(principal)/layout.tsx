import Menu from "@/components/app/Menu";

export default function PrincipalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full flex-row">
            <Menu />
            <main className="flex flex-1 min-w-0 flex-col">
                {children}
            </main>
        </div>
    )
}