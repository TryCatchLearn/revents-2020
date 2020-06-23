import React from 'react';
import EventListItem from './EventListItem';

export default function EventList({ events }) {
  return (
    <>
      {events.map((event) => (
        <EventListItem event={event} key={event.id} />
      ))}
    </>
  );
}
