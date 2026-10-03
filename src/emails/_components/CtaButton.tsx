import * as React from 'react';
import { Button } from '@react-email/components';

interface CtaButtonProps {
  href: string;
  color: string;
  children: React.ReactNode;
}

export const CtaButton: React.FC<CtaButtonProps> = ({ href, color, children }) => {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: color,
        borderRadius: '6px',
        color: '#ffffff',
        display: 'inline-block',
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '100%',
        padding: '14px 32px',
        textDecoration: 'none',
        textAlign: 'center' as const,
      }}
    >
      {children}
    </Button>
  );
};
