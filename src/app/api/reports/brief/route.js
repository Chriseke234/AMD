import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        // 1. Fetch All Dataset Metadata
        const { data: datasets, error: dsError } = await supabase
            .from('datasets')
            .select('id, name, source_type, created_at, dataset_columns(name, data_type)')
            .eq('user_id', user.id)

        if (dsError) throw dsError

        const dataContext = datasets.map(ds => {
            return `Dataset: ${ds.name} (${ds.source_type})\nColumns: ${ds.dataset_columns.map(c => c.name).join(', ')}`
        }).join('\n\n')

        // 2. Generate Executive Brief
        const { text: brief } = await generateText({
            model: openai('gpt-4o-mini'),
            system: `You are an Executive AI Analyst for AskMyData.
            Generate a high-level "Intelligence Brief" in Markdown based on the user's data estate.
            
            STRUCTURE:
            # Neural Executive Brief: [Date]
            ## 1. Inventory Summary
            [High level count of datasets and their types]
            ## 2. Cross-Correlation Opportunities
            [Identify where different datasets could be linked (e.g. by date or ID)]
            ## 3. Forecast Trends & Risks
            [Hypothesize trends based on the available schemas]
            ## 4. Proactive Recommendations
            [Actionable advice for the data owner]
            
            TONE: Professional, insightful, and concise.`,
            prompt: `Summarize this data estate:\n${dataContext}`
        })

        return NextResponse.json({ brief })

    } catch (error) {
        console.error("Neural Brief Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
