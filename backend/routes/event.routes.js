// backend/routes/event.routes.js
const express = require('express');
const { 
    createEvent, 
    getEvents, 
    getRegisteredEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent, 
    registerForEvent 
} = require('../controllers/event.controller');
const { protect, restrictToLeaderOrAdmin } = require('../middleware/auth.middleware');
const router = express.Router();

// Route to get all events registered by the student
router.get('/my-registrations', protect, getRegisteredEvents);

// Get all events
router.get('/', protect, getEvents);

// Create a new event (only leaders or admins)
router.post('/', protect, restrictToLeaderOrAdmin, createEvent);

// Get, update, and delete specific events
router.get('/:id', protect, getEventById);
router.put('/:id', protect, restrictToLeaderOrAdmin, updateEvent);
router.delete('/:id', protect, restrictToLeaderOrAdmin, deleteEvent);

// Register for an event (open to students)
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
