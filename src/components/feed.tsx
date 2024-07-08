import { getPosts } from "@/lib/data/posts/getPost";
import Post from "./post";

export default async function Feed() {
  const posts = await getPosts();

  return (
    <div>
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}
