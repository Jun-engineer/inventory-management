import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

// Extend the NextAuth session interface.
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's email. */
      email?: string | null
      /** The custom token returned from your backend. */
      token?: string
      /** The associated company ID. */
      companyID?: number
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    /** The custom token from your backend. */
    token?: string
  }
}

// Extend the JWT interface.
declare module "next-auth/jwt" {
  interface JWT {
    token?: string
    companyID?: number
    email?: string
  }
}