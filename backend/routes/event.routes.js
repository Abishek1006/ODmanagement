// backend/routes/event.routes.js
const express = require('express');
const { 
    createEvent, 
    getEvents, 
    getRegisteredEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent, 
    registerForEvent,
    getMyCreatedEvents
} = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// Route to get all events registered by the student
router.get('/my-registrations', protect, getRegisteredEvents);

// Get all events
router.get('/', protect, getEvents);

// Create a new event (open to all authenticated users)
router.post('/', protect, createEvent);

// Get, update, and delete specific events
router.get('/my-created-events', protect, getMyCreatedEvents);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

// Register for an event (open to students)
router.post('/:id/register', protect, registerForEvent);

module.exports = router;


