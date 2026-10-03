import { z } from 'zod';
import { ProviderName } from './providers';

// Client config schema
const BrandingSchema = z.object({
  appName: z.string(),
  accentColor: z.string().default('#2563EB'),
  logoUrl: z.string().default(''),
});

const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  keyHash: z.string(), // SHA-256 hash of the API key
  provider: z.enum(['resend', 'brevo']) as z.ZodType<ProviderName>,
  fallbackProvider: (z.enum(['resend', 'brevo']) as z.ZodType<ProviderName>).optional(),
  from: z.string(),
  replyTo: z.string().optional(),
  branding: BrandingSchema,
  allowedTemplates: z.array(z.string()), // e.g. ["otp-code", "couplestory/*"]
  allowedLinkDomains: z.array(z.string()).default([]),
  rateLimitPerMinute: z.number().default(60),
});

export type ClientConfig = z.infer<typeof ClientSchema>;
export type Branding = z.infer<typeof BrandingSchema>;

// Parse clients from env
let clients: ClientConfig[] = [];

export function loadClients(): void {
  const raw = process.env.API_CLIENTS;
  if (!raw) {
    throw new Error('API_CLIENTS env var is required');
  }

  try {
    const parsed = JSON.parse(raw);
    clients = z.array(ClientSchema).parse(parsed);
  } catch (err) {
    throw new Error(`Invalid API_CLIENTS config: ${err}`);
  }
}

export function getClientByHash(keyHash: string): ClientConfig | undefined {
  return clients.find((c) => c.keyHash === keyHash);
}

export function getAllClients(): ClientConfig[] {
  return clients;
}

// Link must be https and its host must match allowedLinkDomains
// ("example.com" exact, "*.example.com" any subdomain). Empty list denies all.
export function isLinkAllowed(allowedDomains: string[], link: string): boolean {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  const host = url.hostname.toLowerCase();
  return allowedDomains.some((d) => {
    const domain = d.toLowerCase();
    if (domain.startsWith('*.')) return host.endsWith(domain.slice(1));
    return host === domain;
  });
}

// Check if a client is allowed to use a template
export function isTemplateAllowed(client: ClientConfig, templateId: string): boolean {
  return client.allowedTemplates.some((pattern) => {
    if (pattern.endsWith('/*')) {
      // Wildcard: "couplestory/*" matches "couplestory/welcome"
      const prefix = pattern.slice(0, -2);
      return templateId.startsWith(prefix + '/');
    }
    return pattern === templateId;
  });
}
