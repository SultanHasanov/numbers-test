const BASE_URL = 'https://f218873f40789afd.mokky.dev/events';

export const createEvent = async (eventData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  return res.json();
};

export const getEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  return res.json();
};

export const joinEvent = async (id, user) => {
  const event = await getEvent(id);
  if (!event || event.participants.length >= event.limit) throw new Error('Event full or not found');

  const updated = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participants: [...event.participants, user],
    }),
  });
  return updated.json();
};
