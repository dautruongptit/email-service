import * as React from 'react';
import { Button } from '@react-email/components';

interface RoseButtonProps {
  href: string;
  children: React.ReactNode;
}

export const RoseButton: React.FC<RoseButtonProps> = ({ href, children }) => {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: '#E8477C',
        borderRadius: '8px',
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
