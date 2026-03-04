"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'h-20 bg-background/80 backdrop-blur-xl border-b' : 'h-24 bg-transparent'}`}>
            <div className="container flex items-center justify-between h-full px-6 mx-auto">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        A
                    </div>
                    <span className="text-2xl font-black tracking-tight text-foreground">
                        AskMyData<span className="text-primary italic">.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden space-x-8 lg:flex items-center">
                    <a href="#features" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Features</a>
                    <a href="#solutions" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Solutions</a>
                    <a href="#pricing" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">Pricing</a>
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px] px-6">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="font-bold uppercase tracking-widest text-[10px] px-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                Join Free
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-xl transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-2xl border-b p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col space-y-6">
                        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary">Features</a>
                        <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary">Solutions</a>
                        <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-foreground hover:text-primary">Pricing</a>
                    </div>
                    <hr className="border-border" />
                    <div className="flex flex-col space-y-4">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center py-6 rounded-2xl font-bold uppercase tracking-widest text-xs">Login</Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full justify-center py-6 rounded-2xl font-bold uppercase tracking-widest text-xs">Join Free</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
