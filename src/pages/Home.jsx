import { useState, useEffect } from 'react';
import { Button, Card, Col, Empty, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';

const { Title } = Typography;

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // В реальном приложении здесь нужно добавить фильтрацию по пользователю
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Мои события</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate('/create')}>
            Создать событие
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Card loading />
      ) : events.length === 0 ? (
        <Empty description="У вас пока нет событий">
          <Button type="primary" onClick={() => navigate('/create')}>
            Создать первое событие
          </Button>
        </Empty>
      ) : (
        events.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  );
};

export default Home;