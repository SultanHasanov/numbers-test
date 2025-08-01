import { Button, Input, Typography } from 'antd';

export default function EventLink({ eventId }) {
  const link = `https://t.me/gather_team_bot?start=event_${eventId}`;

  return (
    <div className="container">
      <Typography.Title level={4}>Событие создано!</Typography.Title>
      <Typography.Paragraph>Поделись ссылкой:</Typography.Paragraph>
      <Input value={link} readOnly style={{ marginBottom: '1rem' }} />
      <Button
        type="primary"
        onClick={() => navigator.clipboard.writeText(link)}
      >
        Скопировать ссылку
      </Button>
    </div>
  );
}
