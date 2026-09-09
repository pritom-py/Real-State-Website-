'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface FilterParams {
  search?: string
  city?: string
  status?: string
  type?: string
  minPrice?: string
  maxPrice?: string
  beds?: string
  baths?: string
  sort?: string
  page?: string
}

interface PropertyFiltersProps {
  currentParams: FilterParams
  total: number
}

const statusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'FOR_SALE', label: 'For Sale' },
  { value: 'JUST_LISTED', label: 'Just Listed' },
  { value: 'UNDER_CONTRACT', label: 'Under Contract' },
  { value: 'SOLD', label: 'Sold' },
]

const typeOptions = [
  { value: 'ALL', label: 'All Types' },
  { value: 'LUXURY_ESTATE', label: 'Luxury Estate' },
  { value: 'SINGLE_FAMILY', label: 'Single Family' },
  { value: 'CONDO', label: 'Condominium' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'sqft', label: 'Largest First' },
]

const priceRanges = [
  { min: '', max: '', label: 'Any Price' },
  { min: '', max: '5000000', label: 'Under $5M' },
  { min: '5000000', max: '10000000', label: '$5M – $10M' },
  { min: '10000000', max: '20000000', label: '$10M – $20M' },
  { min: '20000000', max: '50000000', label: '$20M – $50M' },
  { min: '50000000', max: '', label: '$50M+' },
]

export function PropertyFilters({ currentParams, total }: PropertyFiltersProps) {
  const router = useRouter()
  const [search, setSearch] = useState(currentParams.search ?? '')
  const [showFilters, setShowFilters] = useState(false)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      // Carry over existing params
      Object.entries(currentParams).forEach(([k, v]) => {
        if (v && k !== 'page' && k !== key) params.set(k, v)
      })
      if (value && value !== 'ALL' && value !== '') params.set(key, value)
      router.push(`/properties?${params.toString()}`)
    },
    [currentParams, router]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', search)
  }

  const clearAll = () => {
    setSearch('')
    router.push('/properties')
  }

  const hasFilters = Object.values(currentParams).some((v) => v && v !== '1')

  const selectStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8125rem',
    fontWeight: 300,
    color: 'var(--charcoal)',
    backgroundColor: 'var(--warm-white)',
    border: '1px solid var(--light-gray)',
    padding: '0.625rem 2rem 0.625rem 0.875rem',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.625rem center',
  }

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Search + Filter toggle row */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ flex: '1 1 300px', display: 'flex', gap: '0' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by address, city, or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 0.875rem 0.75rem 2.5rem', border: '1px solid var(--light-gray)', borderRight: 'none', backgroundColor: 'var(--warm-white)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, outline: 'none', color: 'var(--charcoal)' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.625rem' }}>
            Search
          </button>
        </form>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', border: '1px solid var(--light-gray)', backgroundColor: showFilters ? 'var(--charcoal)' : 'var(--warm-white)', color: showFilters ? 'var(--ivory)' : 'var(--charcoal)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.05em' }}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Expandable filter row */}
      {showFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '1.25rem', backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', marginBottom: '1.25rem' }}>
          <select value={currentParams.status ?? 'ALL'} onChange={(e) => updateParam('status', e.target.value)} style={selectStyle} aria-label="Filter by status">
            {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={currentParams.type ?? 'ALL'} onChange={(e) => updateParam('type', e.target.value)} style={selectStyle} aria-label="Filter by property type">
            {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select
            value={currentParams.minPrice && currentParams.maxPrice ? `${currentParams.minPrice}-${currentParams.maxPrice}` : (currentParams.minPrice ? `${currentParams.minPrice}-` : (currentParams.maxPrice ? `-${currentParams.maxPrice}` : ''))}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-')
              const params = new URLSearchParams()
              Object.entries(currentParams).forEach(([k, v]) => { if (v && k !== 'minPrice' && k !== 'maxPrice' && k !== 'page') params.set(k, v) })
              if (min) params.set('minPrice', min)
              if (max) params.set('maxPrice', max)
              router.push(`/properties?${params.toString()}`)
            }}
            style={selectStyle}
            aria-label="Filter by price range"
          >
            {priceRanges.map((r) => (
              <option key={r.label} value={r.min && r.max ? `${r.min}-${r.max}` : (r.min ? `${r.min}-` : (r.max ? `-${r.max}` : ''))}>
                {r.label}
              </option>
            ))}
          </select>

          <select value={currentParams.beds ?? ''} onChange={(e) => updateParam('beds', e.target.value)} style={selectStyle} aria-label="Minimum bedrooms">
            <option value="">Any Beds</option>
            {[3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}+ Beds</option>)}
          </select>

          <select value={currentParams.baths ?? ''} onChange={(e) => updateParam('baths', e.target.value)} style={selectStyle} aria-label="Minimum bathrooms">
            <option value="">Any Baths</option>
            {[3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}+ Baths</option>)}
          </select>

          <select value={currentParams.sort ?? 'newest'} onChange={(e) => updateParam('sort', e.target.value)} style={selectStyle} aria-label="Sort order">
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      {/* Results count + clear */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', margin: 0 }}>
          <span style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{total}</span> {total === 1 ? 'property' : 'properties'} found
        </p>
        {hasFilters && (
          <button onClick={clearAll} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--warm-gray)', textDecoration: 'underline' }}>
            <X size={12} /> Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
