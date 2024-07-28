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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
const maxDescriptionLength = 1000;
import { GifSelector } from "./components/gifSelector";
import { EmotionSelector } from "./components/emotionSelector";
import { MBEmotion, MBSeverity } from "@/lib/types";
import { ImageSelector } from "./components/imageSelector";
import { VisibilitySelector } from "./components/visibilitySelector";
import SmartTextArea from "./components/smartTextArea";
import { SeveritySelector } from "./components/severitySelector";
import { ActivePostElement } from "./components/activePostElements";

// Render the React Component and pass it your fetchGifs as a prop
export default function CardWithForm() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | HTMLImageElement>(null);
  const [emotion, setEmotion] = useState<MBEmotion | null>(null);
  const [severity, setSeverity] = useState<MBSeverity | null>(null);

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
          <div className="relative">
            <SmartTextArea
              onInput={(text) => {
                setDescription(text);
              }}
            />
            <p
              className={cn(
                description.length === maxDescriptionLength && "!text-red-500",
                "text-sm text-muted-foreground font-semibold absolute right-2 top-1"
              )}
            >
              {maxDescriptionLength - description.length}
            </p>
          </div>
          <p className="text-sm text-muted-foreground"></p>
          <ActivePostElement
            emotion={emotion}
            severity={severity}
            image={image}
            onDeleteEmotion={() => {
              console.log("deleting emotion");
              setEmotion(null);
            }}
            onDeleteSeverity={() => {
              setSeverity(null);
            }}
            onDeleteImage={() => {
              setImage(null);
            }}
          />
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
              <SeveritySelector
                onSeveritySelect={(s) => {
                  setSeverity(s);
                }}
              />

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
