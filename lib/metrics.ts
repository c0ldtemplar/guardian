import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client'

export const register = new Registry()

collectDefaultMetrics({ register })

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
})

export const httpRequestDurationMicroseconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
})

export function trackRequest(method: string, path: string, status: number, duration: number) {
    const normalizedPath = path.replace(/\/\d+/g, '/:id').replace(/\?.*$/, '')
    httpRequestsTotal.inc({ method, path: normalizedPath, status: status.toString() })
    httpRequestDurationMicroseconds.observe({ method, path: normalizedPath, status: status.toString() }, duration)
}
