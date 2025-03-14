import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../prisma_client/index"; // Adjust if necessary
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        console.log("abc");

        if (credentials?.email == "" || credentials?.password == "") {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          console.log("Invalid credentials");
          return null;
        }

        console.log("User found:", user);

        // Return user data directly for session and JWT
        return {
          id: user.id,
          email: user.email,
          
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Store the user data in the JWT (JSON Web Token)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // Store role as well if needed
      }
      return token;
    },

    // Use the JWT to attach user data to the session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure your secret is set
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
