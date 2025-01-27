import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCalendarAlt, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const response = await api.get('/events/my-created-events');
        const eventsData = Array.isArray(response.data) ? response.data : response.data.events;
        setEvents(eventsData || []);
      } catch (err) {
        console.error('Error fetching created events:', err);
        setError('Failed to fetch created events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCreatedEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm('Are you sure you want to update this event?');
    if (!confirmed) return;

    try {
      const response = await api.put(`/events/${editingEvent._id}`, editingEvent);
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event._id === response.data._id ? response.data : event))
      );
      setEditingEvent(null);
      alert('Event updated successfully!');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update the event. Please try again.');
    }
  };

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        alert('Event deleted successfully.');
      } catch (err) {
        console.error('Error deleting event:', err);
        alert('Failed to delete the event. Please try again.');
      }
    }
  };

  const renderEventList = () => {
    if (loading) return <div className="flex justify-center items-center h-64">Loading your events...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (events.length === 0) return <div className="text-center text-gray-700 dark:text-gray-300">You have not created any events yet.</div>;

    return events.map((event) => (
      <div
        key={event._id}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600 mb-4"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.name}</h3>
        <p className="text-gray-700 dark:text-gray-300">Prize: {event.prize || 'N/A'}</p>
        <p className="text-gray-700 dark:text-gray-300">Entry Fee: {event.entryFee || 'Free'}</p>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => handleEdit(event)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    ));
  };

  const renderEditForm = () => {
    if (!editingEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Edit Event</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Event Name:</label>
              <input
                type="text"
                value={editingEvent.name}
                onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Prize:</label>
              <input
                type="text"
                value={editingEvent.prize}
                onChange={(e) => setEditingEvent({ ...editingEvent, prize: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Entry Fee:</label>
              <input
                type="number"
                value={editingEvent.entryFee}
                onChange={(e) => setEditingEvent({ ...editingEvent, entryFee: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Entry Type:</label>
              <select
                value={editingEvent.entryType}
                onChange={(e) => setEditingEvent({ ...editingEvent, entryType: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Registration Form Link:</label>
              <input
                type="url"
                value={editingEvent.formLink}
                onChange={(e) => setEditingEvent({ ...editingEvent, formLink: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Registration Deadline:</label>
              <input
                type="date"
                value={editingEvent.deadline}
                onChange={(e) => setEditingEvent({ ...editingEvent, deadline: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Image URL:</label>
              <input
                type="text"
                value={editingEvent.imageUrl}
                onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Event Details:</label>
              <textarea
                value={editingEvent.details}
                onChange={(e) => setEditingEvent({ ...editingEvent, details: e.target.value })}
                className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
              >
                <FaSave className="mr-2" /> Update Event
              </button>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaCalendarAlt className="mr-2" /> My Created Events
      </h2>
      {renderEventList()}
      {renderEditForm()}
    </div>
  );
};

export default MyEvents;