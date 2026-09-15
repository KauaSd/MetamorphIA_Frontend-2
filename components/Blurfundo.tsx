export default function Blurfundo({ children }: { children: React.ReactNode }) {
  return (
    <div className="inset-0 z-[100] flex justify-center items-center bg-[#433F3F]/50 backdrop-blur-lg z-10 fixed inset-0">{children}</div>
  )
}