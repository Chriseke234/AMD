import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/20 backdrop-blur-sm",
                className
            )}
            {...props}
        />
    )
}
