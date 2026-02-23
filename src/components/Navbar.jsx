import { Button } from "./ui/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border)] glass">
            <div className="container flex items-center justify-between h-full px-4 mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)] text-white font-bold">
                        A
                    </div>
                    <span className="text-xl font-bold tracking-tight">AskMyData</span>
                </div>

                <div className="hidden space-x-8 lg:flex">
                    <a href="#features" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Features</a>
                    <a href="#solutions" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Solutions</a>
                    <a href="#pricing" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Pricing</a>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">Login</Button>
                    <Button size="sm">Sign Up</Button>
                </div>
            </div>
        </nav>
    );
}
