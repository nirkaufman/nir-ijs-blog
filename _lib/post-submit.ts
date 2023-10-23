'use server';


import {revalidatePath} from "next/cache";
import {db} from "@/_lib/db";
import {redirect} from "next/navigation";

export async function postSubmit(data: FormData) {
  const title = data.get('title') as string;
  const content = data.get('content') as string;
  
  await db.post.create({
    data: {
      title,
      content,
    }
  })

  revalidatePath('/blog');
  redirect('/blog');

}
