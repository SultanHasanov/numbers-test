import { List, Tag, Typography } from 'antd';

const { Text } = Typography;

const ParticipantList = ({ participants }) => {
  return (
    <List
      dataSource={participants}
      renderItem={(participant, index) => (
        <List.Item>
          <Tag color="blue">{index + 1}</Tag>
          <Text strong>{participant.name}</Text>
        </List.Item>
      )}
      locale={{ emptyText: 'Пока нет участников' }}
    />
  );
};

export default ParticipantList;