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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { use, useEffect, useRef, useState } from "react";

const maxTitleLength = 75;
const maxDescriptionLength = 1000;

import { Image, ImagePlay, Smile, UserRoundSearch } from "lucide-react";
import { GifSelector } from "./components/gifSelector";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { uploadFile } from "@/lib/firebase";

// Render the React Component and pass it your fetchGifs as a prop

export default function CardWithForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<null | HTMLImageElement>(null);

  //ref for image
  //   const image = useRef<null | HTMLImageElement>(null);

  return (
    <div className="flex justify-center items-center px-4 mt-4">
      <Card className="card-w">
        <CardHeader>
          <CardTitle>Report mental breakdown</CardTitle>
          <CardDescription>
            We care about your mental health. Tell us what's going on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-8">
              <div className="flex flex-col space-y-1.5 ">
                <Label htmlFor="title">Title</Label>
                <div className="relative">
                  <Input
                    maxLength={maxTitleLength}
                    id="title"
                    onChange={(e) => {
                      setTitle(e.currentTarget.value);
                    }}
                    placeholder="Name of your project"
                  />
                  <p
                    className={cn(
                      title.length === maxTitleLength && "!text-red-500",
                      "text-sm text-muted-foreground font-semibold absolute top-1 right-2"
                    )}
                  >
                    {maxTitleLength - title.length}
                  </p>
                </div>
              </div>
              {/* <Input
                type="file"
                accept="image/*"
                onInput={(e) => {
                  console.log(e.currentTarget.files);
                  if (!e.currentTarget.files) return;
                  //create a img element and save it in image ref
                  const img = document.createElement("img");
                  img.src = URL.createObjectURL(e.currentTarget.files[0]);
                  image.current = img;
                }}
                id="image"
                onChange={(e) => {
                  setTitle(e.currentTarget.value);
                }}
                placeholder="Name of your project"
              />*/}

              <div className="flex flex-col space-y-1.5 ">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <Textarea
                    className="h-32 max-h-60"
                    maxLength={maxDescriptionLength}
                    id="description"
                    onChange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                    placeholder="Description of your project"
                  />
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
                <p className="text-sm text-muted-foreground">
                  What caused you to have a mental breakdown?
                </p>
              </div>
            </div>
          </form>
          {image !== null && (
            <img
              src={image.src}
              alt="uploaded image"
              className="h-full object-contain w-full max-h-60  mt-2 rounded-md"
            />
          )}
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="flex justify-between border-input  py-2 px-4 w-full bg-muted items-center rounded-md">
            <p className="font-semibold">Add to your post</p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  //create file input element and trigger click
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    if (!input.files) return;
                    //create a img element and save it in image ref
                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(input.files[0]);
                    setImage(img);
                    uploadFile(input.files[0] as File, "testImage");
                  };
                  input.click();
                }}
              >
                <Image />
              </Button>
              <Button variant="ghost" size="icon">
                <UserRoundSearch />
              </Button>
              <GifSelector
                onGifSelect={(url) => {
                  const img = document.createElement("img");
                  img.src = url;
                  setImage(img);
                }}
              />
              <Button variant="ghost" size="icon">
                <Smile />
              </Button>
            </div>
          </div>
          <div className="flex justify-between w-full mt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
