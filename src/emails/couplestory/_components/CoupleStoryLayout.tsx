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

interface CoupleStoryLayoutProps {
  preview: string;
  children: React.ReactNode;
}

// CoupleStory-specific layout with romantic rose theme
export const CoupleStoryLayout: React.FC<CoupleStoryLayoutProps> = ({ preview, children }) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header with gradient */}
          <Section style={header}>
            <Text style={logoText}>CoupleStory</Text>
            <Text style={tagline}>Câu chuyện tình yêu của bạn</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              CoupleStory — Câu chuyện tình yêu của bạn
            </Text>
            <Text style={footerText}>
              Email tự động, vui lòng không trả lời.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const body = {
  backgroundColor: '#fdf2f8',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #fce7f3',
  borderRadius: '12px',
  margin: '40px auto',
  maxWidth: '600px',
  overflow: 'hidden' as const,
};

const header = {
  background: 'linear-gradient(135deg, #E8477C 0%, #be185d 100%)',
  padding: '32px 0 24px',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'center' as const,
};

const tagline = {
  color: 'rgba(255,255,255,0.85)',
  fontSize: '14px',
  margin: '4px 0 0',
  textAlign: 'center' as const,
};

const content = {
  padding: '32px 40px',
};

const hr = {
  borderColor: '#fce7f3',
  margin: '0',
};

const footer = {
  padding: '16px 40px',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
  textAlign: 'center' as const,
};
