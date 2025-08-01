import { useState, useEffect } from 'react';
import CreateEvent from './components/CreateEvent';
import EventLink from './components/EventLink';
import JoinEvent from './components/JoinEvent';

export default function App() {
  const [eventId, setEventId] = useState(null);
  const [joinId, setJoinId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    alert('Пожалуйста, откройте приложение через Telegram');
    return;
  }

  tg.ready();
  const user = tg.initDataUnsafe?.user;
  if (user) {
    setUser({ id: user.id, name: user.first_name });
  }

  const hash = tg.initDataUnsafe?.start_param;
  if (hash?.startsWith('event_')) {
    const id = hash.split('_')[1];
    setJoinId(id);
  }
}, []);


  if (joinId && user) return <JoinEvent eventId={joinId} user={user} />;
  if (eventId) return <EventLink eventId={eventId} />;
  return <CreateEvent setEventId={setEventId} />;
}
