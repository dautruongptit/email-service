import { Resend } from 'resend';
import { EmailProvider, ProviderError, SendEmailParams, SendEmailResult } from './provider';

export class ResendProvider implements EmailProvider {
  readonly name = 'resend';
  private client: Resend;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('RESEND_API_KEY is required');
    this.client = new Resend(apiKey);
  }

  async send(params: SendEmailParams): Promise<SendEmailResult> {
    const { data, error } = await this.client.emails.send({
      from: params.from,
      to: Array.isArray(params.to) ? params.to : [params.to],
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
      tags: params.tags,
      headers: params.idempotencyKey
        ? { 'Idempotency-Key': params.idempotencyKey }
        : undefined,
    });

    if (error) {
      throw new ProviderError(
        `Resend error: ${error.message}`,
        this.name,
        (error as { statusCode?: number | null }).statusCode ?? undefined,
        error.name,
      );
    }

    return {
      id: data?.id ?? 'unknown',
      provider: this.name,
    };
  }
}
