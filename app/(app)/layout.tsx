export default function Logged({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`relative min-h-screen flex flex-row bg-[#F0F0F0]`}>
            <main className="flex-1 min-w-0 font-(family-name:--font-poppins)">
                {children}
            </main>
        </div>
    )
}