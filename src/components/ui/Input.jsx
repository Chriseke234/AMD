import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Input({ className, type, ...props }) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-border bg-background px-4 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium",
                className
            )}
            {...props}
        />
    );
}
