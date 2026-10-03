import { z } from 'zod';
import React from 'react';
import { render } from '@react-email/components';
import { Branding } from './config';

// Template definition
interface TemplateDefinition<T extends z.ZodType> {
  schema: T;
  subject: (data: z.infer<T>, branding: Branding) => string;
  component: React.FC<z.infer<T> & { branding: Branding }>;
  category: string;
}

// Registry map
const templates = new Map<string, TemplateDefinition<any>>();

// Register a template
export function registerTemplate<T extends z.ZodType>(
  id: string,
  definition: TemplateDefinition<T>,
): void {
  templates.set(id, definition);
}

// Get template by ID
export function getTemplate(id: string): TemplateDefinition<any> | undefined {
  return templates.get(id);
}

// Render template to HTML
export async function renderTemplate(
  templateId: string,
  data: Record<string, unknown>,
  branding: Branding,
): Promise<{ subject: string; html: string }> {
  const template = templates.get(templateId);
  if (!template) {
    throw new Error(`Template "${templateId}" not found`);
  }

  // Validate data
  const validated = template.schema.parse(data);

  // Generate subject
  const subject = template.subject(validated, branding);

  // Render HTML
  const element = React.createElement(template.component, { ...validated, branding });
  const html = await render(element);

  return { subject, html };
}

// List all registered templates
export function listTemplates(): string[] {
  return Array.from(templates.keys());
}

// ========================================
// Register all templates
// ========================================

import { OtpCode } from './emails/otp-code';
import { SecurityNotice } from './emails/security-notice';
import { Welcome as CSWelcome } from './emails/couplestory/welcome';
import { PartnerInvite } from './emails/couplestory/partner-invite';

// --- Shared: otp-code ---
registerTemplate('otp-code', {
  schema: z.object({
    name: z.string(),
    otp: z.string().length(6),
    purpose: z.enum(['REGISTER', 'RESET_PASSWORD', 'RESET_PIN']),
    expiresInMinutes: z.number().optional().default(5),
  }),
  subject: (data, branding) => {
    const labels: Record<string, string> = {
      REGISTER: 'Mã xác thực tài khoản',
      RESET_PASSWORD: 'Mã đặt lại mật khẩu',
      RESET_PIN: 'Mã đặt lại PIN',
    };
    return `[${branding.appName}] ${labels[data.purpose] ?? 'Mã OTP'}: ${data.otp}`;
  },
  component: OtpCode as any,
  category: 'authentication',
});

// --- Shared: security-notice ---
registerTemplate('security-notice', {
  schema: z.object({
    name: z.string(),
    action: z.string(),
    timestamp: z.string(),
    device: z.string().optional(),
    ip: z.string().optional(),
  }),
  subject: (data, branding) => `[${branding.appName}] ${data.action} thành công`,
  component: SecurityNotice as any,
  category: 'security',
});

// --- CoupleStory: welcome ---
registerTemplate('couplestory/welcome', {
  schema: z.object({
    name: z.string(),
    plan: z.string(),
    websiteQuota: z.string(),
    photoLimit: z.number(),
    dashboardUrl: z.string().url(),
  }),
  subject: () => 'Chào mừng bạn đến với CoupleStory! 💕',
  component: CSWelcome as any,
  category: 'onboarding',
});

// --- CoupleStory: partner-invite ---
registerTemplate('couplestory/partner-invite', {
  schema: z.object({
    ownerName: z.string(),
    websiteName: z.string(),
    websiteUrl: z.string().url(),
    inviteUrl: z.string().url(),
    expiresInHours: z.number().default(72),
    message: z.string().optional(),
  }),
  subject: (data) => `${data.ownerName} mời bạn cùng tạo câu chuyện tình yêu trên CoupleStory`,
  component: PartnerInvite as any,
  category: 'collaboration',
});
