export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink?: string;
}

export const fetchCalendarEvents = async (accessToken: string): Promise<CalendarEvent[]> => {
  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
    timeMin
  )}&maxResults=20&singleEvents=true&orderBy=startTime`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch calendar events: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
};

export const createCalendarEvent = async (
  accessToken: string,
  event: CalendarEvent
): Promise<CalendarEvent> => {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to create calendar event: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteCalendarEvent = async (
  accessToken: string,
  eventId: string
): Promise<void> => {
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to delete calendar event: ${response.statusText}`);
  }
};
