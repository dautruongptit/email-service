import { EmailProvider, ProviderError, SendEmailParams, SendEmailResult } from './provider';

// Brevo API v3 - using fetch directly for simplicity
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export class BrevoProvider implements EmailProvider {
  readonly name = 'brevo';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('BREVO_API_KEY is required');
    this.apiKey = apiKey;
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    // Parse "Name <email>" format
    const fromParsed = this.parseAddress(params.from);
    const toList = Array.isArray(params.to) ? params.to : [params.to];

    const body: Record<string, unknown> = {
      sender: fromParsed,
      to: toList.map((email) => ({ email })),
      subject: params.subject,
      htmlContent: params.html,
    };

    if (params.replyTo) {
      const replyParsed = this.parseAddress(params.replyTo);
      body.replyTo = replyParsed;
    }

    if (params.tags && params.tags.length > 0) {
      // Brevo supports a single tag string
      body.tags = params.tags.map((t) => t.value);
    }

    const headers: Record<string, string> = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': this.apiKey,
    };

    if (params.idempotencyKey) {
      headers['idempotency-key'] = params.idempotencyKey;
    }

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ProviderError(
        `Brevo error (${response.status}): ${errorBody}`,
        this.name,
        response.status,
      );
    }

    const data = (await response.json()) as { messageId?: string };

    return {
      id: data.messageId ?? 'unknown',
      provider: this.name,
    };
  }

  private parseAddress(address: string): { name?: string; email: string } {
    // Parse "Display Name <email@example.com>" format
    const match = address.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { email: address.trim() };
  }
}
