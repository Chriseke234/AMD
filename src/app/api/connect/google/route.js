import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return cookieStore.get(name)?.value
                },
                set(name, value, options) {
                    cookieStore.set(name, value, options)
                },
                remove(name, options) {
                    cookieStore.set(name, '', { ...options, maxAge: 0 })
                },
            },
        }
    )

    if (!code) {
        // Step 1: Redirect to Google
        const clientID = process.env.GOOGLE_CLIENT_ID
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/google`
        const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.readonly'

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`

        return NextResponse.redirect(authUrl)
    }

    // Step 2: Handle Callback
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/google`,
                grant_type: 'authorization_code',
            })
        })

        const tokens = await tokenRes.json()
        if (tokens.error) throw new Error(tokens.error_description || tokens.error)

        // Store tokens in profiles
        await supabase
            .from('profiles')
            .update({
                google_access_token: tokens.access_token,
                google_refresh_token: tokens.refresh_token,
                google_token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString()
            })
            .eq('id', user.id)

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/datasets/new?connected=google`)
    } catch (error) {
        console.error("Google Auth Error:", error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/datasets/new?error=google_auth_failed`)
    }
}
