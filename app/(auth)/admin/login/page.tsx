'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginSchema, type LoginValues } from '@/lib/validations'
import { Eye, EyeOff, Lock } from 'lucide-react'

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/admin'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email address or password. Please try again.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--ivory)' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', maxWidth: '520px' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.25rem' }}>
            Alexandra Voss
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Admin Portal
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Sign In</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 300, color: 'var(--warm-gray)' }}>
            Access the website management dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="field-label" htmlFor="login-email">Email Address</label>
            <input id="login-email" type="email" {...register('email')} className={`field-input ${errors.email ? 'error' : ''}`} placeholder="admin@alexandravoss.com" autoComplete="email" />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="login-password" type={showPassword ? 'text' : 'password'} {...register('password')} className={`field-input ${errors.password ? 'error' : ''}`} placeholder="••••••••" autoComplete="current-password" style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warm-gray)', padding: 0 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          {error && (
            <div style={{ padding: '0.875rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: '#b91c1c' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Lock size={14} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--mid-gray)' }}>
          Authorized personnel only. All access is logged.
        </div>
      </div>

      {/* Right panel — decorative */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--charcoal)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(248,245,240,0.65)', textAlign: 'center', lineHeight: 1.3 }}>
            "An uncompromising standard of real estate excellence."
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="display: flex"][style*="min-height: 100vh"] > div:last-child { display: none !important; }
          div[style*="max-width: 520px"] { max-width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--ivory)' }} />}>
      <AdminLoginForm />
    </Suspense>
  )
}
