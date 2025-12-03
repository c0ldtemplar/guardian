import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { trackRequest } from '@/lib/metrics'

export function middleware(request: NextRequest) {
    const startTime = Date.now()
    const response = NextResponse.next()
    
    const path = request.nextUrl.pathname
    if (!path.includes('/api/metrics') && !path.includes('/_next') && !path.includes('/static')) {
        const duration = (Date.now() - startTime) / 1000
        
        // Track asynchronously
        queueMicrotask(() => {
            try {
                // trackRequest(request.method, path, response.status, duration)
            } catch (e) {
                console.error('Metrics error:', e)
            }
        })
    }
    
    return response
}

export const config = {
    matcher: '/:path*',
}

