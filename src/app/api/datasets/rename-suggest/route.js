import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export async function POST(req) {
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

    const { datasetId, columns } = await req.json()

    try {
        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: z.object({
                suggestions: z.array(z.object({
                    original: z.string(),
                    suggested: z.string(),
                    reason: z.string()
                }))
            }),
            prompt: `I have a dataset with the following column names: ${columns.join(", ")}. 
            Please suggest cleaner, more descriptive, and standardized column names (snake_case) for these. 
            Provide a short reason for each change.`
        })

        return Response.json({ suggestions: object.suggestions })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
