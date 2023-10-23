# Setup Auth for blog application

# STEP 1: install and init Next Auth

- install `next-auth`

```bash
  npm install next-auth 
```

- create a file `/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth"

const handler = NextAuth({
  ...
})

export {handler as GET, handler as POST}
```

# STEP 2: connect to prisma

- install `@auth/prisma-adapter`

```bash
  npm install @next-auth/prisma-adapter
```

- in `/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth";
import {db} from "@/lib/db";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import Auth0Provider from 'next-auth/providers/auth0';

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    })],
})

export {handler as GET, handler as POST}
```

# STEP 3: create free account at Auht0 and configure

- go to https://auth0.com/ and create a free account
- enter the default application or create a new one
- change the type to `Regular Web Application`
- copy the `Domain` and `Client ID` and `Client Secret` to `.env.local`

```bash
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_ISSUER= // your domain here - add http:// at the begining
```

- under `allow callback urls` add

```bash
 http://localhost:3000/api/auth/callback/auth0
```

- enter `http://localhost:3000` under `allowed logout urls`
- enter `http://localhost:3000` under `allowed web origins`
- enter `http://localhost:3000` under `allowed origins (CORS)`

- save changes

### STEP 4: create Auth models in Prisma

- copy to `schema.prisma`

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String  
  type              String  
  provider          String  
  providerAccountId String  
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?    
  token_type        String? 
  scope             String? 
  id_token          String? @db.Text
  session_state     String? 

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String   
  expires      DateTime 
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?   
  email         String?   @unique
  emailVerified DateTime? 
  image         String?   
  accounts      Account[] 
  sessions      Session[] 
}

model VerificationToken {
  identifier String   
  token      String   @unique
  expires    DateTime 

  @@unique([identifier, token])
}
```

- run `npx prisma migrate dev --name auth`

### STEP 5: use Auth in the app

- wrap with `<SessionProvider>`

```tsx
import {SessionProvider} from 'next-auth/react';

interface OwnProps {
  children: ReactNode;
}

export default function Providers({children}: OwnProps) {
  return (
      <SessionProvider>
        {children}
      </SessionProvider>
  );
}
```

- use function from `next-auth/react` to sign in and out

```bash
import { signIn, signOut } from 'next-auth/react'; 
```

- use the use session hook to get the session
    ```bash
    import { useSession } from 'next-auth/react';
    ```

- you can expose more user data to the session if needed with session callback
- add this to `/api/auth/[...nextauth]/route.ts` NextAuth config
```ts
callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
``` 
