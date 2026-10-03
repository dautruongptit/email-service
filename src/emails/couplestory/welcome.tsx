import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { CoupleStoryLayout } from './_components/CoupleStoryLayout';
import { RoseButton } from './_components/RoseButton';

interface WelcomeProps {
  name: string;
  plan: string;
  websiteQuota: string;
  photoLimit: number;
  dashboardUrl: string;
}

export const Welcome: React.FC<WelcomeProps> = ({
  name,
  plan,
  websiteQuota,
  photoLimit,
  dashboardUrl,
}) => {
  return (
    <CoupleStoryLayout preview={`Chào mừng ${name} đến với CoupleStory!`}>
      <Text style={title}>Chào mừng bạn đến với CoupleStory! 💕</Text>
      <Text style={text}>
        Xin chào <strong>{name}</strong>,
      </Text>
      <Text style={text}>
        Tài khoản của bạn đã được xác thực thành công. Bắt đầu tạo câu chuyện tình yêu của bạn
        ngay nào!
      </Text>

      <Section style={planBox}>
        <Text style={planLabel}>Plan hiện tại</Text>
        <Text style={planValue}>{plan}</Text>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={featureLabel}>Website:</td>
              <td style={featureValue}>{websiteQuota}</td>
            </tr>
            <tr>
              <td style={featureLabel}>Ảnh:</td>
              <td style={featureValue}>{photoLimit} ảnh</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <RoseButton href={dashboardUrl}>Tạo website đầu tiên</RoseButton>
      </Section>
    </CoupleStoryLayout>
  );
};

export default Welcome;

const title = {
  fontSize: '24px',
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

const planBox = {
  backgroundColor: '#fdf2f8',
  borderRadius: '8px',
  margin: '20px 0',
  padding: '20px',
};

const planLabel = {
  color: '#9ca3af',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '1px',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
};

const planValue = {
  color: '#E8477C',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 12px',
};

const featureLabel = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '2px 0',
};

const featureValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  padding: '2px 0',
  textAlign: 'right' as const,
};
