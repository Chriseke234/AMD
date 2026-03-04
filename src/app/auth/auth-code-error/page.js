import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="w-full max-w-md space-y-8 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-6">
                        <ShieldAlert className="h-12 w-12 text-destructive" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black tracking-tighter italic">Authentication <span className="text-destructive">Error.</span></h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        The authentication link was invalid, expired, or has already been used.
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/login">
                        <Button variant="outline" className="h-14 w-full rounded-2xl border-border bg-card group">
                            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-[10px]">Back to Login</span>
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground/60 uppercase font-black tracking-widest">
                    Error Protocol: AUTH_CODE_INVALID
                </p>
            </div>
        </div>
    )
}
