import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, alt = "Avatar", ...props }, ref) => {
  // تحقق من توفر مصدر الصورة قبل محاولة عرضها
  if (!src) {
    return null; // لا تقم بعرض عنصر الصورة إذا كان المصدر غير متوفر
  }

  return (
    <AvatarPrimitive.Image
      ref={ref}
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onLoadingStatusChange={(status) => {
        if (status === "error") {
          console.error("Failed to load avatar image: " + src);
        }
      }}
      onError={(e) => {
        console.warn("Avatar image failed to load, showing fallback");
        // إخفاء عنصر الصورة المعطوب
        if (e.currentTarget) {
          e.currentTarget.style.display = "none";
        }
      }}
      {...props}
    />
  );
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & { name?: string }
>(({ className, name, children, ...props }, ref) => {
  // إنشاء أحرف الاختصار من الاسم إذا كان متوفراً
  const initials = React.useMemo(() => {
    if (name) {
      return name
        .split(' ')
        .map(part => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    return null;
  }, [name]);

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
        className
      )}
      delayMs={300} // تقليل مدة التأخير
      {...props}
    >
      {children || initials || '👤'}
    </AvatarPrimitive.Fallback>
  );
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
