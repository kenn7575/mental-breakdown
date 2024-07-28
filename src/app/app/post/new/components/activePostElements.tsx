"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MBEmotion, MBSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";

export function ActivePostElement({
  image,
  emotion,
  severity,
  onDeleteImage,
  onDeleteEmotion,
  onDeleteSeverity,
}: {
  image: HTMLImageElement | null;
  severity: MBSeverity | null;
  emotion: MBEmotion | null;
  onDeleteImage: () => void;
  onDeleteEmotion: () => void;
  onDeleteSeverity: () => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-scroll mt-4">
      {image !== null && (
        <div className="flex gap-4">
          <div className="w-36 h-36 bg-muted rounded-md relative flex justify-center items-center flex-col gap-2 ">
            <Button
              className="cursor-pointer bg-transparent absolute top-0 left-0  p-0 h-min w-min"
              onClick={() => {
                onDeleteImage();
              }}
            >
              <Badge variant="destructive" className="gap-1">
                <X size={18} />
                Graphic
              </Badge>
            </Button>
            {image.src.split(".").at(-1)?.includes("gif") ? (
              <img
                src={image.src}
                alt={image.alt || "gif"}
                className="h-full object-cover m-0 w-full max-h-60  rounded-md"
                height={110}
                width={110}
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt || "uploaded file"}
                className="h-full object-cover w-full max-h-60  mt-0 rounded-md"
                height={120}
                width={120}
              />
            )}
          </div>
        </div>
      )}

      {emotion !== null && (
        <div className="flex gap-4">
          <div className="w-36 h-36 bg-muted rounded-md relative flex justify-center items-center flex-col gap-2 p-2 pt-4">
            <Button
              className="cursor-pointer bg-transparent absolute top-0 left-0  p-0 h-min w-min"
              onClick={() => {
                onDeleteEmotion();
              }}
            >
              <Badge variant="destructive" className="gap-1">
                <X size={18} />
                Emotion
              </Badge>
            </Button>
            <Image
              src={emotion.image}
              alt={emotion.name}
              height={60}
              width={60}
            />
            <p className="text-center text-sm font-medium text-wrap">
              {emotion.name}
            </p>
          </div>
        </div>
      )}

      {severity !== null && (
        <div className={"flex gap-4"}>
          <div
            className={cn(
              severity.color,
              severity.textColor,
              "w-36 h-36 rounded-md relative pt-4 flex justify-center flex-col"
            )}
          >
            <Button
              className="cursor-pointer bg-transparent absolute top-0 left-0  p-0 h-min w-min"
              onClick={() => {
                onDeleteSeverity();
              }}
            >
              <Badge variant="destructive" className="gap-1">
                <X size={18} />
                Severity
              </Badge>
            </Button>

            <p className={"text-center text-xl font-bold text-wrap "}>
              {severity.name}
            </p>
            <p className={"text-center text-lg text-wrap "}>{severity.id}/10</p>
          </div>
        </div>
      )}
    </div>
  );
}
