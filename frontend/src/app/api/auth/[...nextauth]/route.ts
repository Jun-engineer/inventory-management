import NextAuth, { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const authOptions: NextAuthOptions = {
  providers: [
    // CredentialsProvider is used for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // call my Gin backend login API
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          })
        });
        if (!res.ok) {
          throw new Error("Failed to login");
        }

        // The backend returns JSON which includes a JWT token and user info.
        // For example: { email: "test@test.com", token: "..." }
        const data = await res.json();

        // Return a user object that will be saved to the NextAuth JWT
        return { id: data.email, email: data.email, token: data.token };
      },
    }),
    // OAuth providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "lax" : undefined,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  jwt: {
    async encode({ token, secret }) {
      if (!token) {
        throw new Error("Token is undefined");
      }
      return jwt.sign(token, secret, { algorithm: "HS256" });
    },
    async decode({ token, secret }) {
      if (!token) {
        throw new Error("Token is undefined");
      }
      const decoded = jwt.verify(token as string, secret!, { algorithms: ["HS256"] });
      return decoded as unknown as Record<string, unknown>;
    }
  },
  callbacks: {
    // In your jwt callback:
    async jwt({ token, user }) {
      // When first signing in, user will be defined.
      if (user) {
        if (user.token) {
          token.token = user.token; // backend's JWT token
        }
        token.email = user.email ?? undefined;
        // Decode the backend token to get the companyID claim.
        try {
          const decoded = jwt.verify(user.token!, process.env.NEXTAUTH_SECRET!) as jwt.JwtPayload;
          if (decoded && decoded.companyID) {
            token.companyID = decoded.companyID;
          }
        } catch (error) {
          console.error("Error decoding backend token:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Make token available in the session
      session.user = {
        email: token.email,
        token: token.token,
        companyID: token.companyID,
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
