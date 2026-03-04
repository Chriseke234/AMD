import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase"

export async function POST(req) {
    try {
        const { datasetId, columns, sampleData } = await req.json()
        const supabase = createClient()

        const prompt = `
            You are an elite data scientist and business strategist. 
            Analyze the following dataset metadata and sample rows to provide a 3-sentence "Executive Narrative".
            
            Dataset Columns: ${columns.join(', ')}
            Sample Data Snippet (JSON): ${JSON.stringify(sampleData)}

            Rules:
            1. Keep it to exactly 3 sentences.
            2. Sentence 1: General purpose and structure of the data.
            3. Sentence 2: A key trend or observation visible in the sample.
            4. Sentence 3: A proactive suggestion or potential risk (e.g. anomalies, data quality).
            5. Sound professional, intelligent, and proactive.
            6. Do not use markdown formatting in the response text itself, just plain text.
        `

        const { text } = await generateText({
            model: openai("gpt-4o-mini"),
            prompt,
            temperature: 0.7,
        })

        // Store the narrative summary in the dataset record if needed, 
        // but for now just return it for real-time display.
        await supabase
            .from('datasets')
            .update({ metadata: { narrative_summary: text } })
            .eq('id', datasetId)

        return Response.json({ narrative: text })
    } catch (error) {
        console.error("Narrative Error:", error)
        return Response.json({ error: error.message }, { status: 500 })
    }
}
