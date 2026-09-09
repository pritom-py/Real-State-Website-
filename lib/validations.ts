import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  interest: z.enum(['BUYING', 'SELLING', 'VALUATION', 'GENERAL', 'CONSULTATION']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContact: z.enum(['email', 'phone', 'text']).optional().default('email'),
})

export const propertyInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(5, 'Please tell me more about your inquiry'),
  propertyId: z.string().optional(),
  propertyAddress: z.string().optional(),
})

export const valuationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  propertyAddress: z.string().min(5, 'Please enter your property address'),
  message: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'text']).optional().default('email'),
})

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
export type PropertyInquiryValues = z.infer<typeof propertyInquirySchema>
export type ValuationFormValues = z.infer<typeof valuationSchema>
export type NewsletterValues = z.infer<typeof newsletterSchema>
export type LoginValues = z.infer<typeof loginSchema>
