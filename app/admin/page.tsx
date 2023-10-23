'use client';

import {useSession} from "next-auth/react";
import {postSubmit} from "@/_lib/post-submit";

export default function Admin() {
  const {data} = useSession();

  return (
    <div>
      <h1>Admin</h1>
      <form action={postSubmit}>
        <input type="text" name="title"/>
        <br />
        <textarea name="content"></textarea>
        <button type="submit">Save</button>
      </form>

    </div>
  );
}
