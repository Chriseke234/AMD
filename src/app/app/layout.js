import { Sidebar } from "@/components/app/Sidebar"

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[var(--muted)]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b border-[var(--border)] bg-[var(--background)] lg:hidden flex items-center px-4">
                    {/* Mobile header placeholder */}
                    <div className="font-bold text-[var(--primary)]">AskMyData</div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
