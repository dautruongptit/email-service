import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from './_components/Layout';
import { Branding } from '../config';

interface SecurityNoticeProps {
  name: string;
  action: string; // e.g. "Đổi mật khẩu", "Đăng nhập mới"
  timestamp: string; // e.g. "04/10/2026 00:30"
  device?: string; // e.g. "iPhone 15 - Safari"
  ip?: string;
  branding: Branding;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  name,
  action,
  timestamp,
  device,
  ip,
  branding,
}) => {
  return (
    <Layout preview={`${action} thành công`} branding={branding}>
      <Text style={title}>Thông báo bảo mật</Text>
      <Text style={text}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={text}>
        Hành động <strong>{action}</strong> đã được thực hiện thành công trên tài khoản{' '}
        {branding.appName} của bạn.
      </Text>

      <table style={detailsTable}>
        <tbody>
          <tr>
            <td style={labelCell}>Thời gian:</td>
            <td style={valueCell}>{timestamp}</td>
          </tr>
          {device && (
            <tr>
              <td style={labelCell}>Thiết bị:</td>
              <td style={valueCell}>{device}</td>
            </tr>
          )}
          {ip && (
            <tr>
              <td style={labelCell}>Địa chỉ IP:</td>
              <td style={valueCell}>{ip}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Text style={warning}>
        Nếu bạn không thực hiện hành động này, hãy đổi mật khẩu ngay và liên hệ hỗ trợ.
      </Text>
    </Layout>
  );
};

export default SecurityNotice;

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

const detailsTable = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '16px 0',
  padding: '16px',
  width: '100%',
};

const labelCell = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '600',
  padding: '4px 12px 4px 0',
  verticalAlign: 'top' as const,
  width: '100px',
};

const valueCell = {
  color: '#1a1a1a',
  fontSize: '14px',
  padding: '4px 0',
  verticalAlign: 'top' as const,
};

const warning = {
  backgroundColor: '#fef2f2',
  borderRadius: '6px',
  color: '#991b1b',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  padding: '12px 16px',
};
