export interface SendEmailParams {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
  idempotencyKey?: string;
}

export interface SendEmailResult {
  id: string;
  provider: string;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ProviderError';
  }

  // Rate limit / quota exhausted: worth retrying on another provider
  get isQuotaError(): boolean {
    return (
      this.status === 429 ||
      (this.code !== undefined && /rate_limit|quota/i.test(this.code))
    );
  }
}

export interface EmailProvider {
  readonly name: string;
  send(params: SendEmailParams): Promise<SendEmailResult>;
}
