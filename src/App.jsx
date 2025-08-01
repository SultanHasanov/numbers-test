import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Space, 
  Typography, 
  message, 
  List, 
  Avatar, 
  Badge, 
  Divider,
  Modal,
  Spin,
  Result
} from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  ShareAltOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// API Base URL
const API_BASE = 'https://f218873f40789afd.mokky.dev';

// Telegram Web App integration
const tg = window.Telegram?.WebApp;

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentEventId, setCurrentEventId] = useState(null);

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#1890ff');
    }

    // Проверяем URL для прямого перехода к событию
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');
    if (eventId) {
      setCurrentEventId(eventId);
      setCurrentPage('event');
    }
  }, []);

  const navigateTo = (page, eventId = null) => {
    setCurrentPage(page);
    setCurrentEventId(eventId);
    
    // Обновляем URL
    if (page === 'event' && eventId) {
      window.history.pushState({}, '', `?event=${eventId}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0'
    }}>
      {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
      {currentPage === 'create' && <CreateEvent navigateTo={navigateTo} />}
      {currentPage === 'event' && <EventPage eventId={currentEventId} navigateTo={navigateTo} />}
    </div>
  );
};

const HomePage = ({ navigateTo }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/events`);
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      message.error('Ошибка загрузки событий');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            Сборы друзей
          </Title>
          <Text type="secondary">
            Создавайте встречи и собирайте компанию
          </Text>
        </div>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigateTo('create')}
          style={{
            width: '100%',
            height: '50px',
            borderRadius: '25px',
            fontSize: '16px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          Создать событие
        </Button>

        <Divider orientation="left">Мои события</Divider>

        <Spin spinning={loading}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Text type="secondary">Пока нет созданных событий</Text>
            </div>
          ) : (
            <List
              dataSource={events}
              renderItem={(event) => (
                <List.Item
                  style={{
                    padding: '12px 0',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigateTo('event', event.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#1890ff' }}
                        icon={<CalendarOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{event.title}</span>
                        <Badge 
                          count={`${event.participants?.length || 0}/${event.maxParticipants}`}
                          style={{ backgroundColor: '#52c41a' }}
                        />
                      </div>
                    }
                    description={
                      <div>
                        <div>{formatDate(event.date)}</div>
                        <div style={{ color: '#1890ff' }}>{event.location}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

const CreateEvent = ({ navigateTo }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Преобразуем дату в ISO строку
      const eventData = {
        ...values,
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        participants: [],
        creatorId: tg?.initDataUnsafe?.user?.id || 'demo_user',
        creatorName: tg?.initDataUnsafe?.user?.first_name || 'Пользователь',
        isActive: true
      };

      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (data) {
        message.success('Событие создано!');
        navigateTo('event', data.id);
      }
    } catch (error) {
      message.error('Ошибка создания события');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigateTo('home')}
            style={{ marginRight: '12px' }}
          />
          <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
            Создать событие
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="Название события"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input 
              placeholder="Например: Встреча в кафе"
              style={{ borderRadius: '10px', height: '45px' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea
              placeholder="Опишите детали встречи..."
              rows={3}
              style={{ borderRadius: '10px' }}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Место встречи"
            rules={[{ required: true, message: 'Укажите место' }]}
          >
            <Input 
              placeholder="Адрес или название места"
              style={{ borderRadius: '10px', height: '45px' }}
            />
          </Form.Item>

          <Form.Item
            name="date"
            label="Дата и время"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              showTime
              format="DD.MM.YYYY HH:mm"
              placeholder="Выберите дату и время"
              style={{ width: '100%', borderRadius: '10px', height: '45px' }}
            />
          </Form.Item>

          <Form.Item
            name="maxParticipants"
            label="Максимум участников"
            rules={[{ required: true, message: 'Укажите количество' }]}
          >
            <InputNumber
              min={2}
              max={100}
              placeholder="10"
              style={{ width: '100%', borderRadius: '10px', height: '45px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none'
                }}
              >
                Создать событие
              </Button>
              
              <Button
                size="large"
                onClick={() => navigateTo('home')}
                style={{
                  width: '100%',
                  height: '45px',
                  borderRadius: '22px'
                }}
              >
                Отмена
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const EventPage = ({ eventId, navigateTo }) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [userName, setUserName] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      message.error('Событие не найдено');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const joinEvent = async () => {
    if (!userName.trim()) {
      message.error('Введите ваше имя');
      return;
    }

    setJoining(true);
    try {
      const userId = tg?.initDataUnsafe?.user?.id || `user_${Date.now()}`;
      const newParticipant = {
        id: userId,
        name: userName.trim(),
        joinedAt: new Date().toISOString()
      };

      const updatedParticipants = [...(event.participants || []), newParticipant];
      const isNowFull = updatedParticipants.length >= event.maxParticipants;

      const updatedEvent = {
        ...event,
        participants: updatedParticipants,
        isActive: !isNowFull
      };

      const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent)
      });
      
      if (response.ok) {
        setEvent(updatedEvent);
        setShowJoinModal(false);
        setUserName('');
        
        message.success('Вы присоединились к событию!');
        
        if (isNowFull) {
          Modal.success({
            title: 'Группа собрана!',
            content: 'Все места заняты. Участники получат уведомления.',
            onOk: () => {}
          });
        }
      }
    } catch (error) {
      message.error('Ошибка при присоединении');
    }
    setJoining(false);
  };

  const shareEvent = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Присоединяйся к событию: ${event.title}`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      message.success('Ссылка скопирована!');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <Card
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Result
            status="404"
            title="Событие не найдено"
            subTitle="Возможно, событие было удалено или ссылка неверна"
            extra={
              <Button type="primary" onClick={() => navigateTo('home')}>
                На главную
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const isFull = event.participants?.length >= event.maxParticipants;
  const currentUserId = tg?.initDataUnsafe?.user?.id || null;
  const isAlreadyJoined = event.participants?.some(p => p.id === currentUserId);

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigateTo('home')}
            style={{ marginRight: '12px' }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>
            {event.title}
          </Title>
          
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <Text>{formatDate(event.date)}</Text>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <Text>{event.location}</Text>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TeamOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              <Text>
                {event.participants?.length || 0} из {event.maxParticipants} участников
              </Text>
            </div>
          </Space>

          {isFull && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              borderRadius: '8px'
            }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
              <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                Группа собрана!
              </Text>
            </div>
          )}
        </div>

        {event.description && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={5}>Описание:</Title>
            <Paragraph>{event.description}</Paragraph>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <Title level={5}>Участники:</Title>
          {event.participants?.length > 0 ? (
            <List
              size="small"
              dataSource={event.participants}
              renderItem={(participant, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#1890ff' }}
                        size="small"
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={participant.name}
                    description={`Присоединился ${formatJoinDate(participant.joinedAt)}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">Пока нет участников</Text>
          )}
        </div>

        <Space direction="vertical" style={{ width: '100%' }}>
          {!isFull && !isAlreadyJoined && (
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined />}
              onClick={() => setShowJoinModal(true)}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '25px',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none'
              }}
            >
              Присоединиться
            </Button>
          )}

          {isAlreadyJoined && (
            <Button
              size="large"
              disabled
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '25px',
                fontSize: '16px'
              }}
            >
              Вы уже участвуете
            </Button>
          )}

          <Button
            size="large"
            icon={<ShareAltOutlined />}
            onClick={shareEvent}
            style={{
              width: '100%',
              height: '45px',
              borderRadius: '22px'
            }}
          >
            Поделиться
          </Button>

          <Button
            size="large"
            onClick={() => navigateTo('home')}
            style={{
              width: '100%',
              height: '45px',
              borderRadius: '22px'
            }}
          >
            На главную
          </Button>
        </Space>
      </Card>

      <Modal
        title="Присоединиться к событию"
        open={showJoinModal}
        onOk={joinEvent}
        onCancel={() => setShowJoinModal(false)}
        confirmLoading={joining}
        okText="Присоединиться"
        cancelText="Отмена"
      >
        <div style={{ marginTop: '16px' }}>
          <Text>Ваше имя:</Text>
          <Input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Введите ваше имя"
            style={{ marginTop: '8px', borderRadius: '8px' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default App;