import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
            },
        }
    )

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { data: profile } = await supabase
            .from('profiles')
            .select('google_access_token, google_refresh_token, google_token_expires_at')
            .eq('id', user.id)
            .single()

        if (!profile?.google_access_token) {
            return NextResponse.json({ error: "Not connected to Google" }, { status: 400 })
        }

        // TODO: Token refresh logic if expired

        const res = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'&fields=files(id, name, modifiedTime)', {
            headers: { 'Authorization': `Bearer ${profile.google_access_token}` }
        })

        const data = await res.json()
        if (data.error) throw new Error(data.error.message)

        return NextResponse.json({ files: data.files })
    } catch (error) {
        console.error("List Sheets Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
