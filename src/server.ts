import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import pino from 'pino';
import { loadClients, isTemplateAllowed } from './config';
import { initProviders, sendWithFallback } from './providers';
import { authMiddleware } from './middleware/auth';
import { clientRateLimit } from './middleware/rate-limit';
import { renderTemplate, listTemplates } from './registry';
import { z } from 'zod';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});

const app = express();
app.use(helmet());
app.use(express.json({ limit: '256kb' }));

// Health check - no auth required
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', templates: listTemplates() });
});

// Send email endpoint
const SendRequestSchema = z.object({
  template: z.string(),
  to: z.union([z.string().email(), z.array(z.string().email())]),
  data: z.record(z.unknown()).default({}),
  idempotencyKey: z.string().optional(),
});

app.post(
  '/api/v1/emails/send',
  authMiddleware,
  clientRateLimit,
  async (req, res) => {
    try {
      const client = req.client!;

      // Validate request body
      const body = SendRequestSchema.parse(req.body);

      // Check template permission
      if (!isTemplateAllowed(client, body.template)) {
        res.status(403).json({
          error: `Template "${body.template}" is not allowed for client "${client.id}"`,
        });
        return;
      }

      // Render template
      const { subject, html } = await renderTemplate(
        body.template,
        body.data,
        client.branding,
      );

      // Namespace idempotency key per client
      const idempotencyKey = body.idempotencyKey
        ? `${client.id}:${body.idempotencyKey}`
        : undefined;

      // Send via provider
      const result = await sendWithFallback(
        client.provider,
        client.fallbackProvider,
        {
          from: client.from,
          to: body.to,
          subject,
          html,
          replyTo: client.replyTo,
          tags: [
            { name: 'client', value: client.id },
            { name: 'template', value: body.template },
          ],
          idempotencyKey,
        },
        (err, to) =>
          logger.warn(
            { client: client.id, from: err.provider, to, status: err.status, code: err.code },
            'Primary provider quota/rate limit hit, falling back',
          ),
      );

      logger.info(
        {
          client: client.id,
          template: body.template,
          provider: result.provider,
          emailId: result.id,
          to: body.to,
        },
        'Email sent',
      );

      res.json({
        success: true,
        id: result.id,
        provider: result.provider,
      });
    } catch (err: any) {
      // Zod validation errors
      if (err instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: err.errors,
        });
        return;
      }

      logger.error({ err: err.message, stack: err.stack }, 'Failed to send email');

      const status = err.message?.includes('not found') ? 404 : 500;
      res.status(status).json({ error: err.message });
    }
  },
);

// Start server
const PORT = parseInt(process.env.PORT ?? '3000', 10);

async function start() {
  try {
    loadClients();
    initProviders();

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Email service running on port ${PORT}`);
      logger.info(`Templates: ${listTemplates().join(', ')}`);
    });
  } catch (err: any) {
    logger.fatal({ err: err.message }, 'Failed to start');
    process.exit(1);
  }
}

start();
