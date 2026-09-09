'use client'

export function AdminDeleteButton({ id, action, label = 'Delete', confirmText = 'Are you sure? This cannot be undone.' }: {
  id: string
  action: (formData: FormData) => Promise<void>
  label?: string
  confirmText?: string
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => { if (!confirm(confirmText)) e.preventDefault() }}
        style={{ background: 'none', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.35rem 0.75rem' }}
      >
        {label}
      </button>
    </form>
  )
}
