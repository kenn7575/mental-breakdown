"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export function ImageSelector({
  onImageSelect,
  disabled,
}: {
  onImageSelect: (img: HTMLImageElement) => void;
  disabled?: boolean;
}) {
  return (
    <Button
      disabled={disabled}
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
          onImageSelect(img);
        };
        input.click();
      }}
    >
      <ImageIcon />
    </Button>
  );
}
