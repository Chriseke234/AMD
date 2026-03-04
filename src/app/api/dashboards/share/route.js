import { createClient } from "@/lib/supabase"

export async function POST(req) {
    try {
        const { dashboardId } = await req.json()
        const supabase = createClient()

        // For this demo/elite version, we'll store the public access toggle 
        // in a separate column or just return the ID if it's "publicly available".
        // Real implementation: generate a signed token or UUID.

        await supabase
            .from('dashboards')
            .update({ metadata: { is_public: true, shared_at: new Date() } })
            .eq('id', dashboardId)

        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/share/${dashboardId}`

        return Response.json({ shareUrl })
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}
