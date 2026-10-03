import { Request, Response, NextFunction } from 'express';
import { createHash, timingSafeEqual } from 'crypto';
import { getClientByHash, ClientConfig } from '../config';

// Extend Express Request to include client
declare global {
  namespace Express {
    interface Request {
      client?: ClientConfig;
    }
  }
}

function hashKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const apiKey = authHeader.slice(7); // Remove "Bearer "
  const keyHash = hashKey(apiKey);

  const client = getClientByHash(keyHash);
  if (!client) {
    // Use constant-time comparison to prevent timing attacks
    const dummy = '0'.repeat(64);
    try {
      timingSafeEqual(Buffer.from(keyHash, 'hex'), Buffer.from(dummy, 'hex'));
    } catch {
      // Ignore - just ensuring constant time
    }
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  req.client = client;
  next();
}
