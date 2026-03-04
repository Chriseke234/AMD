"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Sparkles } from "lucide-react";

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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${isScrolled ? 'h-20 bg-background/60 backdrop-blur-[32px] border-b border-white/5 shadow-2xl' : 'h-24 bg-transparent outline-none'}`}>
            <div className="container flex items-center justify-between h-full px-6 mx-auto">
                <Link href="/" className="flex items-center space-x-3 group relative">
                    <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tighter text-foreground leading-none">
                            AskMyData<span className="text-primary italic">.</span>
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-none mt-1">Intelligence OS</span>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute -inset-x-4 -inset-y-2 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden space-x-12 lg:flex items-center">
                    {['Features', 'Intelligence', 'Protocol', 'Pricing'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-primary transition-all duration-300 relative group"
                        >
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
                        </a>
                    ))}
                </div>

                <div className="flex items-center space-x-6">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-bold uppercase tracking-[0.2em] text-[10px] px-6 hover:bg-white/5">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="neo-button font-black uppercase tracking-[0.2em] text-[10px] px-10 rounded-full h-12 bg-primary shadow-2xl shadow-primary/30">
                                Launch App
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-3 text-foreground hover:bg-white/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-[40px] border-b border-white/5 p-8 space-y-8 animate-in fade-in slide-in-from-top-6 duration-500 rounded-b-[2rem]">
                    <div className="flex flex-col space-y-6">
                        {['Features', 'Intelligence', 'Protocol', 'Pricing'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl font-black italic tracking-tighter text-foreground hover:text-primary transition-all"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                    <hr className="border-white/5" />
                    <div className="flex flex-col space-y-4">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-center py-7 rounded-2xl font-black uppercase tracking-widest text-xs border-white/10">Authenticate</Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full justify-center py-7 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20">Initialize Profile</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
