'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { valuationSchema, type ValuationFormValues } from '@/lib/validations'
import { CheckCircle, Send } from 'lucide-react'

export function ValuationFormClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<ValuationFormValues>({
    resolver: zodResolver(valuationSchema) as any,
    defaultValues: { preferredContact: 'email' },
  })

  const onSubmit = async (data: ValuationFormValues) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, interest: 'VALUATION', source: 'valuation_form' }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--light-gray)', backgroundColor: 'var(--warm-white)' }}>
        <CheckCircle size={48} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '0.75rem' }}>Request Received</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, color: 'var(--warm-gray)' }}>
          Alexandra will prepare your complimentary property analysis and be in touch within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--warm-white)', padding: '2.5rem', border: '1px solid var(--light-gray)' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, marginBottom: '0.5rem' }}>Request Your Valuation</h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)', marginBottom: '2rem' }}>
        Complete the form below and Alexandra will prepare a comprehensive market analysis for your property.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="field-label" htmlFor="val-name">Full Name *</label>
            <input id="val-name" {...register('name')} className={`field-input ${errors.name ? 'error' : ''}`} placeholder="Your name" />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="val-email">Email *</label>
            <input id="val-email" type="email" {...register('email')} className={`field-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="val-phone">Phone</label>
          <input id="val-phone" type="tel" {...register('phone')} className="field-input" placeholder="(310) 000-0000" />
        </div>

        <div>
          <label className="field-label" htmlFor="val-address">Property Address *</label>
          <input id="val-address" {...register('propertyAddress')} className={`field-input ${errors.propertyAddress ? 'error' : ''}`} placeholder="123 Sunset Blvd, Beverly Hills, CA 90210" />
          {errors.propertyAddress && <p className="field-error">{errors.propertyAddress.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="val-message">Additional Information</label>
          <textarea id="val-message" {...register('message')} className="field-input" placeholder="Property details, current condition, any recent renovations, reason for valuation…" rows={4} style={{ resize: 'vertical' }} />
        </div>

        <div>
          <label className="field-label">Preferred Contact Method</label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {(['email', 'phone', 'text'] as const).map((method) => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--charcoal)', textTransform: 'capitalize' }}>
                <input type="radio" {...register('preferredContact')} value={method} style={{ accentColor: 'var(--gold)' }} />
                {method}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="field-error">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {loading ? 'Submitting…' : 'Request My Valuation'}
          {!loading && <Send size={14} />}
        </button>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 300, color: 'var(--warm-gray)', textAlign: 'center', margin: 0 }}>
          Complimentary service. Your information is kept strictly confidential.
        </p>
      </form>
    </div>
  )
}
