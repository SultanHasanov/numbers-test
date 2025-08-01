const API_BASE = 'https://f218873f40789afd.mokky.dev';

export const createEvent = async (eventData) => {
  const response = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  return await response.json();
};

export const getEvents = async () => {
  const response = await fetch(`${API_BASE}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return await response.json();
};

export const getEvent = async (eventId) => {
  const response = await fetch(`${API_BASE}/events/${eventId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  return await response.json();
};

export const joinEvent = async (eventId, participant) => {
  const response = await fetch(`${API_BASE}/events/${eventId}/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(participant),
  });
  return await response.json();
};

export const checkEventStatus = async (eventId) => {
  const response = await fetch(`${API_BASE}/events/${eventId}/status`);
  return await response.json();
};