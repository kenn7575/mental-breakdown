import { useState, useEffect, useCallback } from "react";
import { Grid } from "@giphy/react-components";
import { GifsResult, GiphyFetch } from "@giphy/js-fetch-api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { ImagePlay } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function GifSelector({
  onGifSelect,
  disabled = false,
}: {
  onGifSelect: (gif: HTMLImageElement) => void;
  disabled?: boolean;
}) {
  const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gifs, setGifs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch GIFs function that returns the expected type
  const fetchGifs = useCallback(
    async (offset: number): Promise<GifsResult> => {
      setLoading(true);
      const result = await gf.search(searchQuery, { offset, limit: 10 });
      setLoading(false);
      return result;
    },
    [searchQuery]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    fetchGifs(0).then((result) => setGifs(result.data));
  }, [searchQuery, fetchGifs]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant="ghost" size="icon">
          <ImagePlay />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-h-96">
        <div>
          <div className="flex items-center mb-2">
            <Input
              type="text"
              className=""
              placeholder="Search in Giphy"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <img
              src="/giphy.png"
              className="mix-blend-screen ml-auto object-contain"
              width="90px"
              alt="powered by giphy"
            />
          </div>
          <ScrollArea className="w-full h-72 rounded border">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Grid
                key={searchQuery} // Force Grid to re-render on search query change
                onGifClick={(gifObj) => {
                  const img = document.createElement("img");
                  img.src = gifObj.images.original.url;
                  img.alt = gifObj.alt_text || searchQuery;
                  onGifSelect(img);
                }}
                noLink={true}
                className="hover:cursor-pointer"
                width={366}
                columns={2}
                hideAttribution={true}
                fetchGifs={fetchGifs}
              />
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
