import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { CoupleStoryLayout } from './_components/CoupleStoryLayout';
import { RoseButton } from './_components/RoseButton';

interface PartnerInviteProps {
  ownerName: string;
  websiteName: string;
  websiteUrl: string;
  inviteUrl: string;
  expiresInHours: number;
  message?: string;
}

export const PartnerInvite: React.FC<PartnerInviteProps> = ({
  ownerName,
  websiteName,
  websiteUrl,
  inviteUrl,
  expiresInHours,
  message,
}) => {
  return (
    <CoupleStoryLayout preview={`${ownerName} mời bạn cùng tạo câu chuyện tình yêu`}>
      <Text style={title}>Bạn được mời cùng tạo câu chuyện! 💌</Text>
      <Text style={text}>
        <strong>{ownerName}</strong> đã mời bạn cùng chỉnh sửa website tình yêu trên CoupleStory.
      </Text>

      <Section style={websiteBox}>
        <Text style={websiteLabel}>Website</Text>
        <Text style={websiteNameText}>{websiteName}</Text>
        <Text style={websiteUrlText}>{websiteUrl}</Text>
      </Section>

      {message && (
        <Section style={messageBox}>
          <Text style={messageText}>"{message}"</Text>
          <Text style={messageFrom}>— {ownerName}</Text>
        </Section>
      )}

      <Section style={{ textAlign: 'center', margin: '24px 0' }}>
        <RoseButton href={inviteUrl}>Chấp nhận lời mời</RoseButton>
      </Section>

      <Text style={note}>
        Lời mời có hiệu lực trong {expiresInHours} giờ. Nếu bạn chưa có tài khoản CoupleStory,
        bạn sẽ được hướng dẫn đăng ký trước.
      </Text>
    </CoupleStoryLayout>
  );
};

export default PartnerInvite;

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

const websiteBox = {
  backgroundColor: '#fdf2f8',
  borderRadius: '8px',
  margin: '16px 0',
  padding: '16px 20px',
};

const websiteLabel = {
  color: '#9ca3af',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '1px',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
};

const websiteNameText = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const websiteUrlText = {
  color: '#E8477C',
  fontSize: '13px',
  margin: '2px 0 0',
};

const messageBox = {
  borderLeft: '3px solid #E8477C',
  margin: '16px 0',
  padding: '8px 16px',
};

const messageText = {
  color: '#4a4a4a',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  margin: '0',
};

const messageFrom = {
  color: '#9ca3af',
  fontSize: '13px',
  margin: '4px 0 0',
};

const note = {
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
};
