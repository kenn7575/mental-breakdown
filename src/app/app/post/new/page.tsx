"use client";
import "./style.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { use, useEffect, useRef, useState } from "react";

const maxTitleLength = 75;
const maxDescriptionLength = 1000;

import {
  Image as ImageIcon,
  ImagePlay,
  Smile,
  UserRoundSearch,
  X,
} from "lucide-react";
import { GifSelector } from "./components/gifSelector";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { uploadFile } from "@/lib/firebase";
import { EmotionSelector } from "./components/emotionSelector";
import { Badge } from "@/components/ui/badge";
import { Emotion } from "@/lib/types";
import { ImageSelector } from "./components/imageSelector";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { VisibilitySelector } from "./components/visibilitySelector";
import SmartTextArea from "./components/smartTextArea";

// Render the React Component and pass it your fetchGifs as a prop

export default function CardWithForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  const [emotion, setEmotion] = useState<Emotion | null>(null);

  return (
    <div className="flex justify-center items-center px-4 mt-4">
      <Card className="card-w">
        <CardHeader>
          <CardTitle>Report mental breakdown</CardTitle>
          <CardDescription>
            <Label htmlFor="description">
              We care about your mental health. Tell us what's going on.
            </Label>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-8">
              <div className="flex flex-col space-y-1.5 ">
                <div className="relative">
                  {/* <Textarea
                    className="h-32 max-h-60 pr-9d"
                    maxLength={maxDescriptionLength}
                    id="description"
                    onChange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                    placeholder="What caused you to have a mental breakdown?"
                  /> */}
                  <SmartTextArea />
                  <p
                    className={cn(
                      description.length === maxDescriptionLength &&
                        "!text-red-500",
                      "text-sm text-muted-foreground font-semibold absolute right-2 top-1"
                    )}
                  >
                    {maxDescriptionLength - description.length}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground"></p>
              </div>
            </div>
          </form>
          <div className="flex gap-4 overflow-x-scroll mt-4">
            {image !== null && (
              <div className="flex gap-4">
                <div className="w-36 h-36 bg-muted rounded-md relative flex justify-center items-center flex-col gap-2 ">
                  <Button
                    className="cursor-pointer bg-transparent absolute top-0 left-0  p-0 h-min w-min"
                    onClick={() => {
                      setImage(null);
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
                      setEmotion(null);
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="flex justify-between border-input  py-2 px-4 w-full bg-muted items-center rounded-md">
            <p className="font-semibold">Add to your post</p>
            <div className="flex gap-2">
              <ImageSelector
                onImageSelect={(image) => {
                  setImage(image);
                }}
                disabled={
                  image ? image.src.split(".").at(-1)?.includes("gif") : false
                }
              />
              <Button variant="ghost" size="icon">
                <UserRoundSearch />
              </Button>

              <GifSelector
                onGifSelect={(image) => {
                  setImage(image);
                  console.log("git updated");
                }}
                disabled={
                  image ? !image.src.split(".").at(-1)?.includes("gif") : false
                }
              />
              <EmotionSelector
                onEmotionSelect={(e) => {
                  console.log(e);
                  setEmotion(e);
                }}
              />
            </div>
          </div>

          <div className="flex justify-between w-full mt-4">
            <Button variant="outline">Cancel</Button>
            <div className="flex gap-2">
              <VisibilitySelector />
              <Button>Post</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
