import { Button, DatePicker, Form, Input, InputNumber, message } from 'antd';
import { createEvent } from '../api/events';
import dayjs from 'dayjs';

const CreateEventForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const eventData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        current_participants: 0,
        max_participants: values.max_participants,
        is_active: true,
      };
      
      const createdEvent = await createEvent(eventData);
      onSuccess(createdEvent);
      message.success('Событие создано!');
    } catch (error) {
      message.error('Ошибка при создании события');
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Название события"
        name="title"
        rules={[{ required: true, message: 'Введите название события' }]}
      >
        <Input placeholder="Например: Встреча в кафе" />
      </Form.Item>

      <Form.Item
        label="Описание"
        name="description"
        rules={[{ required: true, message: 'Добавьте описание' }]}
      >
        <Input.TextArea rows={4} placeholder="Опишите детали события" />
      </Form.Item>

      <Form.Item
        label="Место проведения"
        name="location"
        rules={[{ required: true, message: 'Укажите место' }]}
      >
        <Input placeholder="Адрес или название места" />
      </Form.Item>

      <Form.Item
        label="Дата"
        name="date"
        rules={[{ required: true, message: 'Выберите дату' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Время"
        name="time"
        rules={[{ required: true, message: 'Выберите время' }]}
      >
        <DatePicker.TimePicker style={{ width: '100%' }} format="HH:mm" />
      </Form.Item>

      <Form.Item
        label="Количество участников"
        name="max_participants"
        rules={[{ required: true, message: 'Укажите количество участников' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Создать событие
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateEventForm;