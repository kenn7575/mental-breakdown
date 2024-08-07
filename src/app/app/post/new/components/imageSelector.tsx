"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

export function ImageSelector({
  onImageSelect,
  disabled,
}: {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      variant="ghost"
      size="icon"
      onClick={() => {
        // Create file input element and trigger click
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          if (!input.files) return;
          const file = input.files[0];
          onImageSelect(file);
        };
        input.click();
      }}
    >
      <ImageIcon />
    </Button>
  );
}
