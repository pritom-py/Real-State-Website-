/**
 * Edge-compatible auth configuration (no Prisma, no bcrypt)
 * Used exclusively in middleware.ts
 */
import NextAuth from 'next-auth'

export const { auth } = NextAuth({
  providers: [],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session }) {
      return session
    },
  },
})
