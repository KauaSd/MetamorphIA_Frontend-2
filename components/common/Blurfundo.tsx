export default function Blurfundo({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center bg-surface-inverse/50 backdrop-blur-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >{children}</div>
  )
}