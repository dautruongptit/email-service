import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { Branding } from '../../config';

interface LayoutProps {
  preview: string;
  branding: Branding;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ preview, branding, children }) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={{ ...header, backgroundColor: branding.accentColor }}>
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.appName}
                height="32"
                style={{ display: 'block', margin: '0 auto' }}
              />
            ) : (
              <Text style={logoText}>{branding.appName}</Text>
            )}
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Email tự động từ {branding.appName}. Vui lòng không trả lời email này.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const body = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '600px',
  overflow: 'hidden' as const,
};

const header = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px 40px',
};

const hr = {
  borderColor: '#e8e8e8',
  margin: '0',
};

const footer = {
  padding: '16px 40px',
};

const footerText = {
  color: '#8c8c8c',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
};
