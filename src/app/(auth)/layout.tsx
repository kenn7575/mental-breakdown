import { ModeToggle } from "@/components/modeToggle";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full p-1 flex justify-center items-center min-h-[100dvh] bg-gradient-to-br from-background to-primary/75">
      <div className="absolute top-2 left-2">
        <ModeToggle />
      </div>
      {children}
    </div>
  );
}
