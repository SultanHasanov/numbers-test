import { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { createEvent } from '../api';

export default function CreateEvent({ setEventId }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newEvent = await createEvent({
        ...values,
        participants: [],
        createdAt: new Date().toISOString(),
      });
      message.success('Событие создано!');
      setEventId(newEvent.id);
    } catch {
      message.error('Ошибка при создании события');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Создание события</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="place" label="Место" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="limit" label="Макс. участников" rules={[{ required: true }]}>
          <InputNumber min={2} max={100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Создать
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
