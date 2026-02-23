"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Key, Copy, RefreshCw, Eye, EyeOff, ShieldCheck, Globe } from "lucide-react"

export default function SettingsPage() {
    const [apiKey, setApiKey] = useState("ak_test_51MzS2GSEpXo8v...")
    const [showKey, setShowKey] = useState(false)

    return (
        <div className="max-w-4xl mx-auto space-y-8 animation-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-[var(--muted-foreground)] text-lg">Manage your API access and account preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Key className="w-5 h-5 mr-3 text-[var(--primary)]" />
                        API Access
                    </CardTitle>
                    <p className="text-sm text-[var(--muted-foreground)]">Use this key to query your datasets programmatically.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Your Secret API Key</label>
                        <div className="flex space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    type={showKey ? "text" : "password"}
                                    value={apiKey}
                                    readOnly
                                    className="font-mono text-xs pr-20 bg-slate-50 dark:bg-slate-900"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                    <button onClick={() => setShowKey(!showKey)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
                                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors" title="Copy to clipboard">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Rotate</Button>
                        </div>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tight flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Never share your secret key in client-side code.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <h4 className="text-sm font-bold flex items-center mb-2">
                            <Globe className="w-4 h-4 mr-2 text-[var(--primary)]" />
                            Webhooks (Optional)
                        </h4>
                        <p className="text-xs text-[var(--muted-foreground)] mb-4">Receive real-time notifications when your data analysis is complete.</p>
                        <Button size="sm" variant="outline">Configure Endpoints</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-100 dark:border-red-900/30">
                <CardHeader>
                    <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold">Delete Account</p>
                            <p className="text-sm text-[var(--muted-foreground)]">Permanently remove all your datasets and analytics data.</p>
                        </div>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
