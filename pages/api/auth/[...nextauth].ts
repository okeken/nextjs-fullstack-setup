import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import userDB from "@servers/models/user";

import { ILogin } from "Types";
import connectDB, { closeDB } from "@servers/config/database";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Email",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@email.com" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        await connectDB();
        const { email, password } = credentials as ILogin;
        try {
          const users = await userDB.findOne({ email });
          if (!users) throw "invalid email";
          const isPasswordValid = await compare(password, users!.password);
          if (!isPasswordValid) throw "invalid password";
          return { email, password };
        } catch (e: any) {
          throw new Error(e);
        } finally {
          await closeDB();
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};

export default NextAuth(authOptions);
