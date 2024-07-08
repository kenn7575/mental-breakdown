import { getPosts } from "@/lib/data/posts/getPost";
import Post from "./post/post";

export default async function Feed() {
  let posts = await getPosts();

  return (
    <div>
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}
