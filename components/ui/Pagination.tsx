import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    params.set('page', String(page))
    return `${baseUrl}?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)

  const btnStyle = (active = false, disabled = false) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: `1px solid ${active ? 'var(--charcoal)' : 'var(--light-gray)'}`,
    backgroundColor: active ? 'var(--charcoal)' : 'transparent',
    color: active ? 'var(--ivory)' : disabled ? 'var(--mid-gray)' : 'var(--charcoal)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    pointerEvents: disabled ? 'none' as const : 'auto' as const,
  })

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Link href={buildUrl(currentPage - 1)} style={btnStyle(false, currentPage <= 1)} aria-label="Previous page" aria-disabled={currentPage <= 1}>
        <ChevronLeft size={16} />
      </Link>

      {pages.map((page, i) => {
        const prev = pages[i - 1]
        return (
          <span key={page} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {prev && page - prev > 1 && (
              <span style={{ color: 'var(--mid-gray)', fontFamily: 'var(--font-sans)' }}>…</span>
            )}
            <Link href={buildUrl(page)} style={btnStyle(page === currentPage)}>
              {page}
            </Link>
          </span>
        )
      })}

      <Link href={buildUrl(currentPage + 1)} style={btnStyle(false, currentPage >= totalPages)} aria-label="Next page" aria-disabled={currentPage >= totalPages}>
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
