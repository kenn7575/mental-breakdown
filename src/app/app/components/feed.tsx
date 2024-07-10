import { getPosts } from "@/lib/data/posts/getPost";
import Post from "./post";

export default async function Feed() {
  let posts = await getPosts();

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 ">
      {posts &&
        posts.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
    </div>
  );
}
