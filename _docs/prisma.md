# Setup prisma for blog application

### STEP 1: install ant init prisma

```bash
    npm i @prisma/client
    npx prisma init
```

### STEP 2: Create database setup prisma

- Go to: `https://render.com/` and create free account
- Create a free postgres database
- ONce th instance ready copy the `External Database URL`
- an `.env` file was created during prisma init
- Paste the database url under a `DATABASE_URL` variable

### STEP 3: Create a utility to keep a cached instance of prisma client

- Create a file `db.ts` under `lib` folder
- paste the following code:

```ts 
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-unused-vars
  let cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.cachedPrisma) {
    // @ts-ignore
    global.cachedPrisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.cachedPrisma;
}

export const db = prisma;
```

### STEP 4: Create your first model
- in `schema.prisma` file paste the following code:

```prisma
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  body      String?
  published Boolean @default(false)
}
```

- run a migration to create the database

```bash
 npx prisma migrate dev --name init
```

### STEP 5: Add post in prisma studio

- run the following command to open prisma studio

```bash
npx prisma studio
```

- select the `post` table and add a new post
- save your changes

### STEP 6: Query the database for all posts

- inside react server component query the posts with this code:
```tsx
export default async function Home() {
  const posts = await db.post.findMany();

  return (
      <main className={styles.main}>
        {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
        ))}
      </main>
  )
}
```

