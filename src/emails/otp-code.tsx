import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { Layout } from './_components/Layout';
import { Branding } from '../config';

// Shared OTP template - used by all clients
// purpose: REGISTER, RESET_PASSWORD, RESET_PIN

const PURPOSE_LABELS: Record<string, { title: string; description: string }> = {
  REGISTER: {
    title: 'Xác thực tài khoản',
    description: 'Cảm ơn bạn đã đăng ký! Sử dụng mã OTP bên dưới để xác thực tài khoản.',
  },
  RESET_PASSWORD: {
    title: 'Đặt lại mật khẩu',
    description: 'Bạn vừa yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới để tiếp tục.',
  },
  RESET_PIN: {
    title: 'Đặt lại mã PIN',
    description: 'Bạn vừa yêu cầu đặt lại mã PIN. Sử dụng mã OTP bên dưới để tiếp tục.',
  },
};

interface OtpCodeProps {
  name: string;
  otp: string;
  purpose: string;
  expiresInMinutes?: number;
  branding: Branding;
}

export const OtpCode: React.FC<OtpCodeProps> = ({
  name,
  otp,
  purpose,
  expiresInMinutes = 5,
  branding,
}) => {
  const labels = PURPOSE_LABELS[purpose] ?? PURPOSE_LABELS.REGISTER;

  return (
    <Layout preview={`Mã OTP của bạn: ${otp}`} branding={branding}>
      <Text style={title}>{labels.title}</Text>
      <Text style={text}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={text}>{labels.description}</Text>

      <Section style={otpContainer}>
        <code style={otpCode}>{otp}</code>
      </Section>

      <Text style={text}>
        Mã có hiệu lực trong <strong>{expiresInMinutes} phút</strong>. Nếu bạn không yêu cầu mã
        này, vui lòng bỏ qua email này.
      </Text>

      <Text style={warning}>
        Không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên {branding.appName}.
      </Text>
    </Layout>
  );
};

export default OtpCode;

// Styles
const title = {
  fontSize: '22px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 16px',
};

const text = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4a4a4a',
  margin: '0 0 12px',
};

const otpContainer = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '24px 0',
  padding: '24px',
  textAlign: 'center' as const,
};

const otpCode = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#1a1a1a',
  fontSize: '36px',
  fontWeight: '700',
  letterSpacing: '8px',
  padding: '0',
};

const warning = {
  backgroundColor: '#fef3c7',
  borderRadius: '6px',
  color: '#92400e',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  padding: '12px 16px',
};
