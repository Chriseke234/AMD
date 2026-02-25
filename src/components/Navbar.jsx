import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/50 glass">
            <div className="container flex items-center justify-between h-full px-4 mx-auto">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        A
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        AskMyData
                    </span>
                </Link>

                <div className="hidden space-x-8 lg:flex">
                    <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Features</a>
                    <a href="#solutions" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Solutions</a>
                    <a href="#pricing" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                </div>

                <div className="flex items-center space-x-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-semibold px-5">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="font-semibold px-5 rounded-full shadow-lg shadow-primary/10">Sign Up</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
