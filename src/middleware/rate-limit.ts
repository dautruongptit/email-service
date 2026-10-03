import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter per client
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientRateLimit(req: Request, res: Response, next: NextFunction): void {
  const client = req.client;
  if (!client) {
    next();
    return;
  }

  const now = Date.now();
  const key = client.id;
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + 60_000 };
    buckets.set(key, bucket);
  }

  bucket.count++;

  if (bucket.count > client.rateLimitPerMinute) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfterSeconds: retryAfter,
    });
    return;
  }

  next();
}

// Cleanup old buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) {
      buckets.delete(key);
    }
  }
}, 5 * 60_000).unref();
