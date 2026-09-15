import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-8",
  md: "size-11",
  lg: "size-16",
  xl: "size-24",
} as const;

interface AvatarProps {
  src: string;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}

export function Avatar({ src, name, size = "md", className, ring = false }: AvatarProps) {
  return (
    <img
      src={src}
      alt={`${name}'s profile picture`}
      loading="lazy"
      className={cn(
        "shrink-0 rounded-full bg-secondary object-cover",
        SIZES[size],
        ring && "ring-2 ring-brand ring-offset-2 ring-offset-background",
        className,
      )}
    />
  );
}
