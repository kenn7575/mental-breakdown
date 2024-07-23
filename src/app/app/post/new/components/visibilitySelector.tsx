import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export function VisibilitySelector() {
  const [option, setOption] = useState({ value: "public", label: "Public" });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          {option.label}{" "}
          <ChevronsUpDown size={20} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Who should see your post?
            </h4>
            <p className="text-sm text-muted-foreground">
              Select the visibility of your post.
            </p>
          </div>

          <RadioGroup defaultValue={option.value || "public"}>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="public"
                  id="public"
                  onClick={() => {
                    setOption({ value: "public", label: "Public" });
                  }}
                />
                <Label htmlFor="r1">Public</Label>
              </div>
              <p className="text-sm text-foreground/80 mt-2 mb-4">
                Everybody can see your post. Regardless of they are logged in.
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="friends"
                  id="friends"
                  onClick={() => {
                    setOption({ value: "friends", label: "Friends" });
                  }}
                />
                <Label htmlFor="r2">Friends</Label>
              </div>
              <p className="text-sm text-foreground/80 mt-2 mb-4">
                Only your friends can see your post.
              </p>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="anonymous"
                  id="r3"
                  onClick={() => {
                    setOption({ value: "anonymous", label: "Anonymous" });
                  }}
                />
                <Label htmlFor="anonymous">Anonymous</Label>
              </div>
              <p className="text-sm text-foreground/80 mt-2">
                Your post will be public but it won't be associated with you.
              </p>
            </div>
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
