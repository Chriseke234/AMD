import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) { return cookieStore.get(name)?.value; },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Optional: filter by datasetId
    const { searchParams } = new URL(request.url)
    const datasetId = searchParams.get('datasetId')

    let query = supabase.from('semantic_definitions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    // If datasetId is provided, get definitions for that dataset AND global definitions (dataset_id is null)
    if (datasetId) {
        query = query.or(`dataset_id.eq.${datasetId},dataset_id.is.null`)
    }

    const { data: semantics, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(semantics || [])
}

export async function POST(request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) { return cookieStore.get(name)?.value; },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { term, definition, datasetId } = await request.json()

    if (!term || !definition) {
        return NextResponse.json({ error: "Term and definition are required." }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('semantic_definitions')
        .insert({
            user_id: user.id,
            term: term.trim(),
            definition: definition.trim(),
            dataset_id: datasetId || null
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function DELETE(request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) { return cookieStore.get(name)?.value; },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

    const { error } = await supabase
        .from('semantic_definitions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
