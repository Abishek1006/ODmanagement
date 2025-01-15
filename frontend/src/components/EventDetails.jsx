// src/components/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading event details...</p>;

  const handleRegister = () => {
    window.open(event.formLink, '_blank');
  };

  return (
    <div className="event-details-page">
      {event.imageUrl && <img src={event.imageUrl} alt={event.name} />}
      <h1>{event.name}</h1>
      <p>Prize: {event.prize}</p>
      <p>Entry Fee: ₹{event.entryFee}</p>
      <p>Type: {event.entryType}</p>
      <p>Details: {event.details}</p>
      <button onClick={handleRegister}>Register Now</button>
    </div>
  );
};
export default EventDetails;
