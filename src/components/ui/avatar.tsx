import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar as BaseAvatar, AvatarImage as BaseAvatarImage, AvatarFallback as BaseAvatarFallback } from "@base-ui/react/avatar"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <BaseAvatar
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src ? (
        <BaseAvatarImage
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
        />
      ) : (
        <BaseAvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
          {fallback || "?"}
        </BaseAvatarFallback>
      )}
    </BaseAvatar>
  )
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <BaseAvatarImage
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseAvatarFallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
