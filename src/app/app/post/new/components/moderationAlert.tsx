import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ActionResponse } from "@/lib/types/moderation";
import { useEffect, useState } from "react";
import { Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModerationAlert({
  onPost,
  moderation,
}: {
  onPost: () => void;
  moderation: {
    flags: Array<string>;
    action: ActionResponse;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  useEffect(() => {
    if (moderation && moderation.flags?.length > 0) {
      setIsOpen(true);
      if (moderation.action === ActionResponse.NOTIFY) {
        setTitleText("Are you sure you want to post this?");
        setDescriptionText(
          `This post has been flagged as potentially harmful under the following categories: (${moderation.flags.join(
            ", "
          )}). It may violate our terms of service. If you decide to proceed with posting, it will be subject to review by our moderation team.`
        );
      } else if (moderation.action === ActionResponse.SUSPEND) {
        setTitleText("Post content warning");
        setDescriptionText(
          `This post has been flagged as potentially harmful under the following categories: (${moderation.flags.join(
            ", "
          )}). It may violate our terms of service. If you decide to proceed with posting, it will be hidden from the public until it is reviewed by our moderation team.`
        );
      } else if (moderation.action === ActionResponse.QUARANTINE) {
        setTitleText("Your account has been temporarily locked");
        setDescriptionText(
          `This post has triggered a serious concern due to its content, specifically flagged under categories:  (${moderation.flags.join(
            ", "
          )}). As a result, your account has been temporarily locked pending a thorough review by our moderation team. This action is taken to ensure the safety and integrity of our community.`
        );
      }
    }
    console.log("moderation", titleText);
  }, [moderation]);

  function reset() {
    setIsOpen(false);
    setTitleText("");
    setDescriptionText("");
  }
  function post() {
    reset();
    onPost();
  }
  if (moderation?.action === ActionResponse.RESCUE)
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl">
              You are not alone!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              We care deeply about your well-being. It sounds like you might be
              going through a really difficult time. Please know that you're not
              alone—help is available. If you're in immediate danger, we urge
              you to reach out to emergency services or a trusted person who can
              support you. You can also contact a crisis hotline for help:{" "}
              <br />
              <div className="flex text-primary items-center gap-2 mt-4">
                <Phone size={20} />
                <a className="font-bold " href="tel:70201201">
                  Livslinien (Denmark)
                </a>
              </div>
              <div className="flex text-primary items-center gap-2 mt-4">
                <Globe size={20} />
                <a
                  className="font-bold "
                  href=" https://blog.opencounseling.com/suicide-hotlines/"
                >
                  Other resources (International)
                </a>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Cancel post</AlertDialogCancel>
            <AlertDialogAction className="bg-transparent border border-muted-foreground text-foreground hover:bg-muted">
              Post now
            </AlertDialogAction>
            <Button asChild>
              <a href="https://blog.opencounseling.com/suicide-hotlines/">
                Get help
              </a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  else if (moderation?.action === ActionResponse.NONE) return null;
  else
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{titleText}</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              {descriptionText.slice(0, descriptionText.indexOf("("))}
              <span className="font-bold text-red-500">
                {descriptionText.slice(
                  descriptionText.indexOf("(") + 1,
                  descriptionText.indexOf(")")
                )}
              </span>
              {descriptionText.slice(descriptionText.indexOf(")") + 1)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Cancel upload</AlertDialogCancel>
            <AlertDialogAction onClick={post}>Post</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
}
