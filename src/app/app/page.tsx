import Feed from "./components/feed";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading posts</p>}>
      <Feed />
    </Suspense>
  );
}
