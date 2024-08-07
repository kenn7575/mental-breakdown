"use client";
import { cn } from "@/lib/utils";
import "../style.css";
import { severityList } from "@/lib/client/posts/severity/severityList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MBSeverity } from "@/lib/types";
export function SeveritySelector({
  onSeveritySelect,
}: {
  onSeveritySelect: (severity: MBSeverity | null) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Gauge />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-60" asChild>
        <ScrollArea className="w-full h-60  rounded border ">
          {/* Emotions */}
          {severityList.length > 0 ? (
            <div className=" gap-2 flex flex-col">
              <button
                className={cn(
                  "w-full bg-muted rounded p-2 text-start font-bold text-lg flex gap-1 items-center text-foreground/80"
                )}
                onClick={() => {
                  onSeveritySelect(null);
                }}
              >
                <span className="text-xl">🚫 </span>
                Don't specify
              </button>
              {severityList.map((option, index) => (
                <button
                  key={option.id}
                  className={cn(
                    "col-span-2 w-full bg-muted rounded p-2 text-start font-bold text-xl flex gap-2",
                    option.color,
                    option.textColor
                  )}
                  onClick={() => {
                    onSeveritySelect(option);
                  }}
                >
                  <span className="font-black">{index + 1}</span>
                  {option.name}
                </button>
              ))}
            </div>
          ) : (
            <p className="font-semibold m-2">No results!</p>
          )}
        </ScrollArea>
        {/* <Card className="">
          <CardContent className="pt-6">
            <div>
              <CardTitle>Severity</CardTitle>
              <CardDescription>How severe is your breakdown?</CardDescription>
            </div>
            <Carousel
              className="w-3/4 m-8 mx-auto"
              opts={{ startIndex: defaultValue || 0 }}
            >
              <CarouselContent>
                {severityList.map((option, index) => (
                  <CarouselItem key={index}>
                    <button className="w-full">
                      <Card className={option.color}>
                        <CardContent
                          className={cn(
                            "flex h-32 items-center justify-center flex-col p-6"
                          )}
                        >
                          <p
                            className={cn(
                              "text-3xl font-bold",
                              option.textColor
                            )}
                          >
                            {option.name}
                          </p>
                          <p
                            className={cn(
                              "text-sm font-medium",
                              option.textColor
                            )}
                          >
                            {index + 1}/10
                          </p>
                        </CardContent>
                      </Card>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card> */}
        {/* <div>
          <input
            type="range"
            onInput={(e) => {
              setSeverity(e.target.value);
            }}
            max={10}
            min={1}
            step={1}
            className={cn("w-[60%]", className)}
          />
          <Slider
            color="#009900"
            onValueChange={(e) => {
              setSeverity(e[0]);
            }}
            defaultValue={[1]}
            max={10}
            min={1}
            step={1}
            className={cn("w-[60%]", className)}
            {...props}
          />
          <p
            className={cn(
              "font-black text-white text-xl",
              getTextColor(severity)
            )}
          >
            {getName(severity)}
          </p>
        </div> */}
      </PopoverContent>
    </Popover>
  );
}
