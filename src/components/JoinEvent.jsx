import { useEffect, useState } from 'react';
import { getEvent, joinEvent } from '../api';
import { Typography, Button, message, Spin } from 'antd';

export default function JoinEvent({ eventId, user }) {
  const [event, setEvent] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    getEvent(eventId).then(setEvent);
  }, [eventId]);

  const handleJoin = async () => {
    try {
      const updated = await joinEvent(eventId, user);
      setEvent(updated);
      setJoined(true);
      if (updated.participants.length === updated.limit) {
        updated.participants.forEach((p) => {
          // use Telegram API on server to notify
          console.log(`Notify user ${p.id}`);
        });
      }
    } catch {
      message.error('Невозможно присоединиться');
    }
  };

  if (!event) return <Spin className="container" />;

  return (
    <div className="container">
      <Typography.Title level={4}>{event.title}</Typography.Title>
      <Typography.Paragraph>Место: {event.place}</Typography.Paragraph>
      <Typography.Paragraph>
        Участников: {event.participants.length} / {event.limit}
      </Typography.Paragraph>
      {!joined && (
        <Button type="primary" onClick={handleJoin}>
          Присоединиться
        </Button>
      )}
      {joined && <Typography.Text type="success">Вы в группе!</Typography.Text>}
    </div>
  );
}
