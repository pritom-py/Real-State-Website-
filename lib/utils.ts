import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    const val = price / 1_000_000
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}M`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatPriceFull(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

export function formatSqFt(sqFt: number): string {
  return new Intl.NumberFormat('en-US').format(sqFt)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    FOR_SALE: 'For Sale',
    JUST_LISTED: 'Just Listed',
    UNDER_CONTRACT: 'Under Contract',
    SOLD: 'Sold',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    FOR_SALE: 'text-emerald-700 bg-emerald-50',
    JUST_LISTED: 'text-amber-700 bg-amber-50',
    UNDER_CONTRACT: 'text-blue-700 bg-blue-50',
    SOLD: 'text-stone-700 bg-stone-100',
  }
  return colors[status] || 'text-stone-700 bg-stone-100'
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SINGLE_FAMILY: 'Single Family',
    CONDO: 'Condominium',
    TOWNHOUSE: 'Townhouse',
    MULTI_FAMILY: 'Multi-Family',
    LAND: 'Land',
    COMMERCIAL: 'Commercial',
    LUXURY_ESTATE: 'Luxury Estate',
    PENTHOUSE: 'Penthouse',
  }
  return labels[type] || type
}
