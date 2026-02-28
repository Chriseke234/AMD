import { Sidebar } from "@/components/app/Sidebar"

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#050506] selection:bg-primary selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl lg:hidden flex items-center px-8 z-40">
                    <div className="font-black text-2xl text-white tracking-tighter italic">
                        AskMyData<span className="text-primary not-italic">.</span>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-12 relative">
                    {/* Persistent Background Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
