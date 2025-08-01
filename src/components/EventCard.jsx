import { Card, Progress, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const EventCard = ({ event }) => {
  const progress = Math.round((event.current_participants / event.max_participants) * 100);
  const isFull = event.current_participants >= event.max_participants;

  return (
    <Link to={`/event/${event.id}`}>
      <Card
        hoverable
        style={{ marginBottom: 16 }}
        cover={
          <div style={{ height: 120, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Title level={3} style={{ margin: 0 }}>{event.title}</Title>
          </div>
        }
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong>Когда: </Text>
          <Text>{dayjs(event.date).format('DD.MM.YYYY')} в {event.time}</Text>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Text strong>Где: </Text>
          <Text>{event.location}</Text>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Progress percent={progress} status={isFull ? 'exception' : 'active'} />
          <Text>
            {event.current_participants} из {event.max_participants} участников
            {isFull && <Tag color="red" style={{ marginLeft: 8 }}>Набрано</Tag>}
          </Text>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;