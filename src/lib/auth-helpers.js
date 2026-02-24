export const getURL = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin
    }

    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env vars
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
        'http://localhost:3000'

    // Make sure to include `https://` when not localhost
    url = url.includes('http') ? url : `https://${url}`

    // Ensure no trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url
}
