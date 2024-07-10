"use client";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ImagePlay } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { env } from "process";
export function GifSelector() {
  const gf = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY || "");
  console.log("env", env.REACT_APP_GIPHY_API_KEY);

  // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
  const fetchGifs = (offset: number) =>
    gf.search("mental breakdown", { offset, limit: 2 });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ImagePlay />
        </Button>
      </DialogTrigger>
      <DialogContent className="w- overflow-scroll">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 w-full rounded-md border">
          <Grid
            onGifClick={(gif) => {
              console.log(gif.images.original.webp);
            }}
            noLink={true}
            width={334}
            columns={2}
            fetchGifs={fetchGifs}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
