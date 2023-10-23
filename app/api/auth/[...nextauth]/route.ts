import NextAuth from "next-auth";
import Auth0Provider from 'next-auth/providers/auth0';
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {db} from "@/_lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
      Auth0Provider({
        clientId: process.env.AUTH0_CLIENT_ID!,
        clientSecret: process.env.AUTH0_CLIENT_SECRET!,
        issuer: process.env.AUTH0_ISSUER,
      }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
});

export {handler as GET, handler as POST}
