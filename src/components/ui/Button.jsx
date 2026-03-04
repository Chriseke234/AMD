import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/10',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-muted border border-border',
    outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
    ghost: 'hover:bg-muted text-foreground',
    accent: 'bg-accent text-accent-foreground hover:opacity-90',
  };

  const sizes = {
    sm: 'h-9 px-4 text-xs font-bold uppercase tracking-widest',
    md: 'h-11 px-6 py-2 text-sm font-bold uppercase tracking-widest',
    lg: 'h-14 sm:h-16 px-8 sm:px-10 text-base font-black uppercase tracking-widest',
    icon: 'h-10 w-10 p-0',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl sm:rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
