import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaCalendarAlt, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreatedEvents();
  }, []);

  const fetchCreatedEvents = async () => {
    try {
      const response = await api.get('/events/my-created-events');
      // Ensure we're setting an array
      setEvents(Array.isArray(response.data) ? response.data : response.data.events || []);
    } catch (err) {
      setError('Failed to fetch created events');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/events/${editingEvent._id}`, editingEvent);
      setEvents(events.map(event => 
        event._id === response.data._id ? response.data : event
      ));
      setEditingEvent(null);
      alert('Event updated successfully!');
    } catch (err) {
      alert('Failed to update event');
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
        alert('Event deleted successfully');
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const renderEditForm = () => {
    if (!editingEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prize</label>
                <input
                  type="text"
                  value={editingEvent.prize}
                  onChange={(e) => setEditingEvent({...editingEvent, prize: e.target.value})}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Entry Fee</label>
                <input
                  type="number"
                  value={editingEvent.entryFee}
                  onChange={(e) => setEditingEvent({...editingEvent, entryFee: e.target.value})}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Entry Type</label>
                <select
                  value={editingEvent.entryType}
                  onChange={(e) => setEditingEvent({...editingEvent, entryType: e.target.value})}
                  className="p-2 border rounded w-full"
                >
                  <option value="individual">Individual</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={editingEvent.startDate?.split('T')[0]}
                  onChange={(e) => setEditingEvent({...editingEvent, startDate: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={editingEvent.endDate?.split('T')[0]}
                  onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={editingEvent.startTime}
                  onChange={(e) => setEditingEvent({...editingEvent, startTime: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={editingEvent.endTime}
                  onChange={(e) => setEditingEvent({...editingEvent, endTime: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration Deadline</label>
                <input
                  type="date"
                  value={editingEvent.deadline?.split('T')[0]}
                  onChange={(e) => setEditingEvent({...editingEvent, deadline: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration Form Link</label>
                <input
                  type="url"
                  value={editingEvent.formLink}
                  onChange={(e) => setEditingEvent({...editingEvent, formLink: e.target.value})}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Details</label>
              <textarea
                value={editingEvent.details}
                onChange={(e) => setEditingEvent({...editingEvent, details: e.target.value})}
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FaSave className="inline mr-2" /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        <FaCalendarAlt className="inline mr-2" /> My Created Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {Array.isArray(events) && events.map(event => (
        <div key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold">{event.name}</h3>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(event)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {renderEditForm()}
    </div>
  );
};

export default MyEvents;