import { DataProvider } from "@/components/app/state/DataProvider";

export default function Logged({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DataProvider>
            <div className={`relative min-h-screen flex flex-row bg-surface-muted`}>
                <main className="flex-1 min-w-0 font-(family-name:--font-poppins)">
                    {children}
                </main>
            </div>
        </DataProvider>
    )
}
