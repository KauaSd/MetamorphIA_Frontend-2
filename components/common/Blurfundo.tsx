export default function Blurfundo({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      className="inset-0 z-[100] flex justify-center items-center bg-[#433F3F]/50 backdrop-blur-lg z-10 fixed inset-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >{children}</div>
  )
}