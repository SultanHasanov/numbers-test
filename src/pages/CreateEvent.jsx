import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import CreateEventForm from '../components/CreateEventForm';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSuccess = (event) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div style={{ padding: 16 }}>
      <Card title="Создать новое событие">
        <CreateEventForm onSuccess={handleSuccess} />
      </Card>
    </div>
  );
};

export default CreateEvent;