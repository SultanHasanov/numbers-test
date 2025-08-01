import { useState, useEffect } from 'react';
import CreateEvent from './components/CreateEvent';
import EventLink from './components/EventLink';
import JoinEvent from './components/JoinEvent';

export default function App() {
  const [eventId, setEventId] = useState(null);
  const [joinId, setJoinId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    const uid = tg.initDataUnsafe.user;
    setUser({ id: uid?.id, name: uid?.first_name });

    const hash = tg.initDataUnsafe.start_param;
    if (hash?.startsWith('event_')) {
      const id = hash.split('_')[1];
      setJoinId(id);
    }
  }, []);

  if (joinId && user) return <JoinEvent eventId={joinId} user={user} />;
  if (eventId) return <EventLink eventId={eventId} />;
  return <CreateEvent setEventId={setEventId} />;
}
