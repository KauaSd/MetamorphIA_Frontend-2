'use client'

interface CheckBoxAlunoprops {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function CheckBoxAluno({ label, checked, onChange }: CheckBoxAlunoprops) {
  return (
    <label className="inline-flex items-center gap-2.5 rounded-full bg-surface-overlay px-4 py-2 cursor-pointer select-none hover:bg-surface-overlay-hover transition-colors w-42">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />

      <div
        className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-surface-secondary border-secondary' : 'border-secondary bg-transparent'
        }`}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 text-inverse-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <span className="text-sm font-medium text-tertiary">{label}</span>
    </label>
  )
}