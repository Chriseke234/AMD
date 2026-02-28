import { createClient } from "@/lib/supabase"

export const PLAN_LIMITS = {
    free: {
        datasets: 3,
        queries: 100,
        teams: 0,
        dashboards: 1
    },
    pro: {
        datasets: 9999,
        queries: 9999,
        teams: 5,
        dashboards: 9999
    },
    enterprise: {
        datasets: 9999,
        queries: 9999,
        teams: 999,
        dashboards: 9999
    }
}

export async function checkPlanLimit(userId, type) {
    const supabase = createClient()

    // Get user's current subscription
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_tier')
        .eq('user_id', userId)
        .single()

    const tier = sub?.plan_tier || 'free'
    const limit = PLAN_LIMITS[tier][type]

    // Get current usage
    let count = 0
    if (type === 'datasets') {
        const { count: dsCount } = await supabase.from('datasets').select('*', { count: 'exact', head: true }).eq('user_id', userId)
        count = dsCount || 0
    } else if (type === 'queries') {
        const { count: qCount } = await supabase.from('ai_usage').select('*', { count: 'exact', head: true }).eq('user_id', userId)
        count = qCount || 0
    } else if (type === 'dashboards') {
        const { count: dbCount } = await supabase.from('dashboards').select('*', { count: 'exact', head: true }).eq('user_id', userId)
        count = dbCount || 0
    }

    return {
        allowed: count < limit,
        current: count,
        limit,
        tier
    }
}
