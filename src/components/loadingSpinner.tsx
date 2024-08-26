import { LoaderCircle } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-background/80">
      <LoaderCircle className="animate-spin" size={36} />
    </div>
  );
}
