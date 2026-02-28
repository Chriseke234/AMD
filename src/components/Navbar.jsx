import Link from "next/link";
import { Button } from "./ui/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/10 glass transition-all duration-300">
            <div className="container flex items-center justify-between h-full px-6 mx-auto">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-[1.2rem] bg-primary text-white font-black text-xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                        A
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50">
                        AskMyData
                    </span>
                </Link>

                <div className="hidden space-x-10 lg:flex items-center">
                    <a href="#features" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:text-glow transition-all">Features</a>
                    <a href="#solutions" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:text-glow transition-all">Solutions</a>
                    <a href="#pricing" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:text-glow transition-all">Pricing</a>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-xs px-6 py-2">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="font-bold uppercase tracking-widest text-xs px-6 py-6 rounded-full shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Join Free
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
