const Event = require('../models/event.model');
const User = require('../models/user.model');

// Helper function to check if user can edit any event
const canEditAnyEvent = (user) => {
  return user.isAdmin || 
         ['hod', 'ac'].includes(user.primaryRole) || 
         user.secondaryRoles.some(role => ['hod', 'ac'].includes(role));
};
// Helper function to check if user can create events
const canCreateEvent = (user) => {
  return user.isAdmin || 
         ['teacher', 'tutor', 'ac', 'hod'].includes(user.primaryRole) || 
         (user.primaryRole === 'student' && user.isLeader) ||
         user.secondaryRoles.some(role => ['teacher', 'tutor', 'ac', 'hod'].includes(role));
};

// Validation helper function
const validateEventInput = (eventData) => {
  const errors = [];

  if (!eventData.name || eventData.name.trim() === '') {
    errors.push('Event name is required');
  }

  // if (!eventData.prize || eventData.prize.trim() === '') {
  //   errors.push('Prize is required');
  // }

  if (!eventData.formLink || eventData.formLink.trim() === '') {
    errors.push('Registration form link is required');
  }

  // if (!['individual', 'team'].includes(eventData.entryType)) {
  //   errors.push('Invalid entry type. Must be either "individual" or "team"');
  // }

  return errors;
};

// Create an event
exports.createEvent = async (req, res) => {
  try {
    if (!canCreateEvent(req.user)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const { 
      name, prize, entryFee, entryType, image, details, 
      formLink, deadline, startDate, endDate, startTime, endTime 
    } = req.body;

    if (!name || !formLink || !deadline || !startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = new Event({
      name,
      prize,
      entryFee,
      entryType,
      image,
      details,
      formLink,
      deadline,
      startDate,
      endDate,
      startTime,
      endTime,
      createdBy: req.user._id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Validate date
    if (!(currentDate instanceof Date && !isNaN(currentDate))) {
      return res.status(400).json({ 
        message: 'Invalid date format',
        errors: ['Current date validation failed']
      });
    }

    const events = await Event.find({
      deadline: { $gt: currentDate }
    })
      .populate('createdBy', 'name')
      .sort({ startDate: 1, startTime: 1 });

    // Handle no events found
    if (!events || events.length === 0) {
      return res.status(200).json({ 
        message: 'No upcoming events found',
        events: [] 
      });
    }

    // Log successful retrieval
    console.log(`Retrieved ${events.length} upcoming events`);

    res.status(200).json({
      message: 'Events fetched successfully',
      count: events.length,
      events: events
    });

  } catch (error) {
    console.error('Error in getEvents:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      return res.status(500).json({
        message: 'Database error',
        error: 'Failed to query events database'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        error: error.message
      });
    }

    // Generic error handler
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
exports.getMyCreatedEvents = async (req, res) => {
  try {
    // Validate user ID
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch events created by the user
    const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    // Handle no events found
    if (events.length === 0) {
        return res.status(200).json({ message: 'No events found', events: [] });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error in getMyCreatedEvents:', error);
    res.status(500).json({ 
      message: 'Error fetching created events', 
      error: error.message 
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ 
        message: 'Event not found',
        errors: ['No event with the given ID exists']
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      message: 'Error fetching event', 
      error: error.message 
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString() && !canEditAnyEvent(req.user)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const { 
      name, prize, entryFee, entryType, image, details, 
      formLink, deadline, startDate, endDate, startTime, endTime 
    } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        name,
        prize,
        entryFee,
        entryType,
        image,
        details,
        formLink,
        deadline,
        startDate,
        endDate,
        startTime,
        endTime
      },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};// Update an event
// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        message: 'Event not found',
        errors: ['No event with the given ID exists']
      });
    }

    // Check permissions
    if (event.createdBy.toString() !== req.user._id.toString() && !canEditAnyEvent(req.user)) {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this event',
        errors: ['Insufficient permissions']
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      message: 'Event deleted successfully',
      deletedEvent: event 
    });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting event', 
      error: error.message 
    });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    if (req.user.primaryRole !== 'student') {
      return res.status(403).json({ 
        message: 'Only students can register for events',
        errors: ['Non-student users cannot register']
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        message: 'Event not found',
        errors: ['No event with the given ID exists']
      });
    }

    // Check if already registered
    const alreadyRegistered = event.registrations.includes(req.user._id);
    if (alreadyRegistered) {
      return res.status(400).json({ 
        message: 'Registration failed',
        errors: ['You are already registered for this event']
      });
    }

    // Add user to registrations
    event.registrations.push(req.user._id);
    await event.save();

    res.status(200).json({ 
      message: 'Registration successful', 
      event 
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ 
      message: 'Error registering for the event', 
      error: error.message 
    });
  }
};

// Get events registered by the current user
exports.getRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({ registrations: req.user._id })
      .sort({ createdAt: -1 });

    if (events.length === 0) {
      return res.status(404).json({ 
        message: 'No registered events found',
        events: [] 
      });
    }

    res.status(200).json({ 
      message: 'Registered events fetched successfully', 
      events 
    });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ 
      message: 'Error fetching registered events', 
      error: error.message 
    });
  }
};