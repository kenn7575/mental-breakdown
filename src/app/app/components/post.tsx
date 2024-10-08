import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

import { CornerDownRight, Share2 } from "lucide-react";
import { getTokenPayload } from "@/app/actions/getTokenPayload";

import { CommentSection } from "./comments/commentSection";
import type { DisplayPost } from "@/lib/types/post";
import { formatTimeSince } from "@/lib/utils";
import ReactionMenu from "./reactions/reactionMenu";
export default async function Post({ post }: { post: DisplayPost }) {
  const user = await getTokenPayload();
  console.log("post: ", post);
  return (
    <Card className="max-w-96">
      <CardHeader className="">
        <div className="flex-row justify-between items-start">
          <div className="flex items-center justify-between space-x-4">
            <Link href="#" className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.user?.profile_picture} />
                <AvatarFallback>
                  {post.user?.firstname[0] + post.user?.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none mt-2">
                  {post.user?.firstname} {post.user?.lastname}
                  {post.posted_at && (
                    <span className="text-sm text-muted-foreground">
                      {" · "}
                      {formatTimeSince(post.posted_at)}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{post.user?.username}
                </p>
              </div>
            </Link>
            <Button variant="ghost" size="icon" className="!m-0">
              <Share2 strokeWidth={1.5} />
            </Button>
          </div>
          <div className="flex gap-2 mt-1 items-center ml-4">
            <CornerDownRight />
            <p className="">
              is feeling <span className="font-bold">frustrated</span>{" "}
            </p>
            <span className="text-2xl">😩</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-max block">
        <p className="text-foreground ">{post.body}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Photo by Drew Beamer"
            height={2048}
            width={1024}
            className="rounded-md object-cover mt-8"
          />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex gap-8">
          <ReactionMenu
            reaction_count={post.reaction_count}
            post_id={post.id}
            userReaction={
              post.reactions?.find((r) => r.user_id === user?.id)
                ?.reaction_type || null
            }
          />
          <div className="flex flex-col gap-1 items-center">
            <CommentSection
              commentCount={post.comment_count || 0}
              postId={post?.id || ""}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
