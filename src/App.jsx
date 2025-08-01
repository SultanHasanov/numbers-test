import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import ruRU from 'antd/locale/ru_RU';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/event/:eventId" element={<EventPage />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;