import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Result, Skeleton } from 'antd';
import { getEvent, checkEventStatus } from '../api/events';
import EventDetails from '../components/EventDetails';

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData);
        
        // Проверяем статус события периодически
        const interval = setInterval(async () => {
          const status = await checkEventStatus(eventId);
          if (status.is_active !== eventData.is_active) {
            setEvent(prev => ({ ...prev, is_active: status.is_active }));
            if (!status.is_active) {
              clearInterval(interval);
              // Здесь можно добавить уведомление для пользователя
            }
          }
        }, 5000);
        
        return () => clearInterval(interval);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleJoinSuccess = () => {
    // Обновляем данные после успешного присоединения
    getEvent(eventId).then(updatedEvent => {
      setEvent(updatedEvent);
    });
  };

  if (loading) {
    return <Skeleton active />;
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Не удалось загрузить событие"
        subTitle="Проверьте правильность ссылки или попробуйте позже"
        extra={<Button type="primary" href="/">На главную</Button>}
      />
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <EventDetails event={event} onJoin={handleJoinSuccess} />
    </div>
  );
};

export default EventPage;