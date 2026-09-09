'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { propertyInquirySchema, type PropertyInquiryValues } from '@/lib/validations'
import { Send, CheckCircle } from 'lucide-react'

export function PropertyInquiryForm({ propertyId, propertyAddress }: { propertyId: string; propertyAddress: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<PropertyInquiryValues>({
    resolver: zodResolver(propertyInquirySchema) as any,
    defaultValues: { propertyId, propertyAddress },
  })

  const onSubmit = async (data: PropertyInquiryValues) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, interest: 'BUYING', source: 'property_inquiry' }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', padding: '2rem', textAlign: 'center' }}>
        <CheckCircle size={40} style={{ color: 'var(--gold)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, marginBottom: '0.75rem' }}>Inquiry Received</h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)' }}>
          Thank you for your interest. Alexandra will be in touch within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ backgroundColor: 'var(--warm-white)', border: '1px solid var(--light-gray)', padding: '1.75rem' }}>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, marginBottom: '1.25rem' }}>Inquire About This Property</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="field-label" htmlFor="inq-name">Full Name *</label>
          <input id="inq-name" {...register('name')} className={`field-input ${errors.name ? 'error' : ''}`} placeholder="Your name" />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="inq-email">Email Address *</label>
          <input id="inq-email" type="email" {...register('email')} className={`field-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="inq-phone">Phone (Optional)</label>
          <input id="inq-phone" type="tel" {...register('phone')} className="field-input" placeholder="(310) 000-0000" />
        </div>

        <div>
          <label className="field-label" htmlFor="inq-message">Message</label>
          <textarea id="inq-message" {...register('message')} className="field-input" placeholder="I'd like to schedule a viewing…" rows={4} style={{ resize: 'none' }} />
          {errors.message && <p className="field-error">{errors.message.message}</p>}
        </div>

        <input type="hidden" {...register('propertyId')} />
        <input type="hidden" {...register('propertyAddress')} />

        {error && <p className="field-error">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Sending…' : 'Send Inquiry'}
          {!loading && <Send size={14} />}
        </button>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6875rem', fontWeight: 300, color: 'var(--warm-gray)', textAlign: 'center', margin: 0 }}>
          Your information is kept strictly confidential.
        </p>
      </div>
    </form>
  )
}
