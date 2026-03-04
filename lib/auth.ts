import { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // adapter type mismatch between next-auth versions
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubId: profile.id.toString(),
          username: profile.login,
          avatar: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true, avatar: true },
        })
        if (dbUser) {
          session.user.username = dbUser.username
          session.user.image = dbUser.avatar || session.user.image
        }
      }
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'github' && profile) {
        const ghProfile = profile as unknown as { id: number; login: string; name?: string; avatar_url: string; email?: string }
        // Upsert user with github info
        await prisma.user.upsert({
          where: { githubId: ghProfile.id.toString() },
          update: {
            username: ghProfile.login,
            name: ghProfile.name || ghProfile.login,
            avatar: ghProfile.avatar_url,
            email: ghProfile.email,
          },
          create: {
            githubId: ghProfile.id.toString(),
            username: ghProfile.login,
            name: ghProfile.name || ghProfile.login,
            avatar: ghProfile.avatar_url,
            email: ghProfile.email,
          },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
