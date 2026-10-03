import { EmailProvider, ProviderError, SendEmailParams, SendEmailResult } from './provider';
import { ResendProvider } from './resend-provider';
import { BrevoProvider } from './brevo-provider';

export type ProviderName = 'resend' | 'brevo';

const providers = new Map<ProviderName, EmailProvider>();

export function initProviders(): void {
  const resendKey = process.env.RESEND_API_KEY;
  const brevoKey = process.env.BREVO_API_KEY;

  if (resendKey) {
    providers.set('resend', new ResendProvider(resendKey));
  }

  if (brevoKey) {
    providers.set('brevo', new BrevoProvider(brevoKey));
  }

  if (providers.size === 0) {
    throw new Error('At least one provider API key is required (RESEND_API_KEY or BREVO_API_KEY)');
  }
}

export function getProvider(name: ProviderName): EmailProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Provider "${name}" is not configured. Check your API key.`);
  }
  return provider;
}

// Send via primary; on 429 / quota exceeded, retry once on the fallback.
// Any other error (or a fallback failure) is thrown to the caller.
export async function sendWithFallback(
  primary: ProviderName,
  fallback: ProviderName | undefined,
  params: SendEmailParams,
  onFallback?: (err: ProviderError, to: ProviderName) => void,
): Promise<SendEmailResult> {
  try {
    return await getProvider(primary).send(params);
  } catch (err) {
    if (
      !fallback ||
      fallback === primary ||
      !providers.has(fallback) ||
      !(err instanceof ProviderError) ||
      !err.isQuotaError
    ) {
      throw err;
    }
    onFallback?.(err, fallback);
    return getProvider(fallback).send(params);
  }
}

export { EmailProvider, ProviderError, SendEmailParams, SendEmailResult } from './provider';
