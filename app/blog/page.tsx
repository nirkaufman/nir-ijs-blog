import {db} from "@/_lib/db";

export default async function Blog() {
  const posts = await db.post.findMany();

  return (
      <>
      <h3>Blog</h3>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
      </>
  )
}
