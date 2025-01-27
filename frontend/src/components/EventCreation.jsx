import React, { useState } from 'react';
import api from '../services/api';
import { FaCalendarPlus, FaImage, FaInfoCircle, FaLink, FaMoneyBillAlt, FaTag } from 'react-icons/fa';

const EventCreation = () => {
  const [eventData, setEventData] = useState({
    name: '',
    prize: '',
    entryFee: '',
    entryType: 'individual',
    details: '',
    formLink: '',
    deadline: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 700 * 1024) {
      setError('Image size must be less than 700KB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Image data length:', image?.length);
      console.log('Event data:', {...eventData, image: image ? 'Image present' : 'No image'});

      const eventPayload = {
        ...eventData,
        image
      };

      const response = await api.post('/events', eventPayload);
      console.log('Event creation response:', response.data);
      
      alert('Event created successfully!');
      setEventData({
        name: '',
        prize: '',
        entryFee: '',
        entryType: 'individual',
        details: '',
        formLink: '',
        deadline: '',
      });
      setImage(null);
      setError(null);
    } catch (error) {
      console.error('Event creation error:', error);
      setError(error.response?.data?.message || 'Failed to create event');
    }
  };
return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-gray-900 dark:border-gray-600">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaCalendarPlus className="mr-2" /> Create New Event
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaTag className="mr-2" /> Event Name
          </label>
          <input
            type="text"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaMoneyBillAlt className="mr-2" /> Prize
          </label>
          <input
            type="text"
            name="prize"
            value={eventData.prize}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaMoneyBillAlt className="mr-2" /> Entry Fee
          </label>
          <input
            type="number"
            name="entryFee"
            value={eventData.entryFee}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaInfoCircle className="mr-2" /> Entry Type
          </label>
          <select
            name="entryType"
            value={eventData.entryType}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
          >
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaLink className="mr-2" /> Registration Form Link
          </label>
          <input
            type="url"
            name="formLink"
            value={eventData.formLink}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            placeholder="Enter Google Form or registration link"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaCalendarPlus className="mr-2" /> Registration Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={eventData.deadline}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaImage className="mr-2" /> Event Poster
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
          />
          {image && (
            <img
              src={image}
              alt="Event preview"
              className="mt-2 w-48 h-48 object-cover rounded-lg"
            />
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 flex items-center">
            <FaInfoCircle className="mr-2" /> Event Details
          </label>
          <textarea
            name="details"
            value={eventData.details}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-900 dark:border-gray-600 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default EventCreation;