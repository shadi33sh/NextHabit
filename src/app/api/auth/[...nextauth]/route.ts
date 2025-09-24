import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const client = await clientPromise
        const db = client.db()
        const user = await db.collection("users").findOne({ email: credentials?.email })

        if (!user) throw new Error("No user found")
        if (!user.emailVerified) throw new Error("Please verify your email first")

        const isValid = await bcrypt.compare(credentials!.password, user.hashedPassword)
        if (!isValid) throw new Error("Invalid password")

        return user
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,  
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
})

export { handler as GET, handler as POST }
