import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export default async function proxy(request) {
    let response = NextResponse.next({
        request: {
            headers: await request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                async get(name) {
                    const cookie = await request.cookies.get(name)
                    return cookie?.value
                },
                async set(name, value, options) {
                    await request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: await request.headers,
                        },
                    })
                    await response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                async remove(name, options) {
                    await request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: await request.headers,
                        },
                    })
                    await response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protect /app and /admin routes
    if (request.nextUrl.pathname.startsWith('/app') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check for admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || (profile.role !== 'admin' && profile.role !== 'super-admin')) {
            return NextResponse.redirect(new URL('/app', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/app/:path*', '/admin/:path*'],
}
