'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { contactFormSchema, type ContactFormValues } from '@/lib/validations'
import { CheckCircle, Send } from 'lucide-react'

export function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema) as any,
    defaultValues: { interest: 'GENERAL', preferredContact: 'email' },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contact_form' }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px solid var(--light-gray)', backgroundColor: 'var(--warm-white)' }}>
        <CheckCircle size={48} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, marginBottom: '0.75rem' }}>Message Received</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, color: 'var(--warm-gray)', maxWidth: '360px', margin: '0 auto' }}>
          Thank you for reaching out. Alexandra will respond personally within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label" htmlFor="cnt-name">Full Name *</label>
          <input id="cnt-name" {...register('name')} className={`field-input ${errors.name ? 'error' : ''}`} placeholder="Your name" />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="cnt-email">Email *</label>
          <input id="cnt-email" type="email" {...register('email')} className={`field-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="field-label" htmlFor="cnt-phone">Phone</label>
          <input id="cnt-phone" type="tel" {...register('phone')} className="field-input" placeholder="(310) 000-0000" />
        </div>
        <div>
          <label className="field-label" htmlFor="cnt-interest">I Am Interested In *</label>
          <select id="cnt-interest" {...register('interest')} className={`field-input ${errors.interest ? 'error' : ''}`} style={{ cursor: 'pointer' }}>
            <option value="BUYING">Buying a Property</option>
            <option value="SELLING">Selling a Property</option>
            <option value="VALUATION">Home Valuation</option>
            <option value="CONSULTATION">Schedule Consultation</option>
            <option value="GENERAL">General Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="cnt-message">Message *</label>
        <textarea id="cnt-message" {...register('message')} className={`field-input ${errors.message ? 'error' : ''}`} placeholder="Tell me about your real estate goals…" rows={5} style={{ resize: 'vertical' }} />
        {errors.message && <p className="field-error">{errors.message.message}</p>}
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

      {error && <p className="field-error" style={{ fontSize: '0.875rem' }}>{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {loading ? 'Sending…' : 'Send Message'}
        {!loading && <Send size={14} />}
      </button>
    </form>
  )
}
