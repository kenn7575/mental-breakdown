"use client";
import { useState, useEffect, useCallback } from "react";
import { emotions } from "@/lib/ui/posts/emojis/EmotionList";
import Image from "next/image";
import "../style.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MBEmotion } from "@/lib/types";

export function EmotionSelector({
  onEmotionSelect,
}: {
  onEmotionSelect: ({ image, name }: MBEmotion) => void;
}) {
  const [search, setSearch] = useState("");
  const [emojiList, setEmojiList] = useState(emotions);
  useEffect(() => {
    setEmojiList(
      emotions
        .filter((e) => {
          if (!search) return emotions;
          return e.name.toLowerCase().includes(search.toLowerCase());
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [search]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Smile />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="emotion-card-width max-h-80 ">
        <div>
          <div className="flex items-center mb-2">
            <Input
              type="text"
              className=""
              placeholder="Search emotion"
              onChange={(e) => {
                setSearch(e.currentTarget.value);
              }}
              value={search}
            />
          </div>
          <ScrollArea className="w-full h-60  rounded border ">
            {/* Emotions */}
            {emojiList.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 grid-flow-dense">
                {emojiList.map((emotion) => (
                  <div
                    key={emotion.image}
                    className={cn(
                      emotion.name.length > 10 ? "col-span-2" : "",
                      "w-full bg-muted rounded p-2"
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="!m-0 justify-start gap-2 flex "
                      onClick={() => {
                        onEmotionSelect(emotion);
                      }}
                    >
                      <Image
                        src={emotion.image}
                        alt={emotion.name}
                        width={50}
                        height={50}
                      />
                      {emotion.name}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-semibold m-2">No results!</p>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
