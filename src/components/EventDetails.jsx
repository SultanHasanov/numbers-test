import { Button, Card, Descriptions, Divider, Progress, Space, Tag, Typography, message } from 'antd';
import { joinEvent } from '../api/events';
import ParticipantList from './ParticipantList';

const { Title, Text } = Typography;

const EventDetails = ({ event, onJoin }) => {
  const progress = Math.round((event.current_participants / event.max_participants) * 100);
  const isFull = event.current_participants >= event.max_participants;

  const handleJoin = async () => {
    try {
      // В реальном приложении здесь нужно получить данные пользователя из Telegram WebApp
      const user = {
        name: 'User', // Замените на данные из Telegram
        telegram_id: '123' // Замените на данные из Telegram
      };
      
      await joinEvent(event.id, user);
      message.success('Вы успешно присоединились!');
      onJoin();
    } catch (error) {
      message.error('Ошибка при присоединении к событию');
      console.error(error);
    }
  };

  return (
    <div>
      <Title level={2}>{event.title}</Title>
      <Text type="secondary">{event.description}</Text>
      
      <Divider />
      
      <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Дата и время">
          {event.date} в {event.time}
        </Descriptions.Item>
        <Descriptions.Item label="Место">
          {event.location}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={isFull ? 'red' : 'green'}>
            {isFull ? 'Набрано' : 'Набирается'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
      
      <div style={{ marginBottom: 24 }}>
        <Text strong>Прогресс набора:</Text>
        <Progress percent={progress} status={isFull ? 'exception' : 'active'} />
        <Text>
          {event.current_participants} из {event.max_participants} участников
        </Text>
      </div>
      
      {!isFull && (
        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleJoin}
          style={{ marginBottom: 24 }}
        >
          Присоединиться
        </Button>
      )}
      
      <Card title="Участники">
        <ParticipantList participants={event.participants || []} />
      </Card>
      
      <Divider />
      
      <Text type="secondary">
        Поделитесь ссылкой с друзьями: {window.location.href}
      </Text>
    </div>
  );
};

export default EventDetails;