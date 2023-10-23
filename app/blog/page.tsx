import {db} from "@/_lib/db";
import {Post} from "@prisma/client";

export default async function Blog() {
  const posts:Post[] = await db.post.findMany();

  return (
      <>
      <h3>Blog</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
      </>
  )
}
