const Event = require('../models/event.model');
const User = require('../models/user.model');
const { createNotification } = require('./notification.controller');

// Helper function to check if user can edit any event
const canEditAnyEvent = (user) => {
  return user.isAdmin || 
         ['hod', 'ac'].includes(user.primaryRole) || 
         user.secondaryRoles.some(role => ['hod', 'ac'].includes(role));
};

// Helper function to check if user can create events
const canCreateEvent = (user) => {
  return user.isAdmin || 
         ['ac', 'hod', 'teacher'].includes(user.primaryRole) || 
         (user.primaryRole === 'student' && user.isLeader) ||
         user.secondaryRoles.some(role => ['ac', 'hod', 'teacher'].includes(role));
};

// Validation helper function
const validateEventInput = (eventData) => {
  const errors = [];

  if (!eventData.name || eventData.name.trim() === '') {
    errors.push('Event name is required');
  }

  if (!eventData.prize || eventData.prize.trim() === '') {
    errors.push('Prize is required');
  }

  // if (typeof eventData.entryFee !== 'number' || eventData.entryFee < 0) {
  //   errors.push('Entry fee must be a non-negative number');
  // }

  if (!['individual', 'team'].includes(eventData.entryType)) {
    errors.push('Invalid entry type. Must be either "individual" or "team"');
  }

  return errors;
};

// Create an event
exports.createEvent = async (req, res) => {
  try {
    // Check user permissions
    if (!canCreateEvent(req.user)) {
      return res.status(403).json({ 
        message: 'You do not have permission to create events',
        errors: ['Insufficient permissions']
      });
    }

    // Validate input
    const validationErrors = validateEventInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    const { name, prize, entryFee, entryType, imageUrl, details } = req.body;

    // Create event
    const event = new Event({
      name,
      prize,
      entryFee,
      entryType,
      imageUrl: imageUrl || undefined,
      details: details || '',
      createdBy: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ 
      message: 'Error creating event', 
      error: error.message 
    });
  }
};


// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error.message 
    });
  }
};

// Get events created by the current user
exports.getMyCreatedEvents = async (req, res) => {
  try {
    console.log('User ID:', req.user._id); // Debug user ID
    const events = await Event.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log('Found events:', events); // Debug found events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error in getMyCreatedEvents:', error);
    res.status(500).json({ 
      message: 'Error fetching created events', 
      error: error.message 
    });
  }
};


// Get a specific event by ID
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

// Update an event
exports.updateEvent = async (req, res) => {
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
        message: 'You do not have permission to update this event',
        errors: ['Insufficient permissions']
      });
    }

    // Validate input
    const validationErrors = validateEventInput({
      ...event.toObject(), 
      ...req.body
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }

    // Update event fields
    const { name, prize, entryFee, entryType, imageUrl, details } = req.body;
    event.name = name || event.name;
    event.prize = prize || event.prize;
    event.entryFee = entryFee || event.entryFee;
    event.entryType = entryType || event.entryType;
    event.imageUrl = imageUrl || event.imageUrl;
    event.details = details || event.details;

    const updatedEvent = await event.save();

    // Create a notification for event update
    await createNotification(
      req.user._id, 
      `Event updated: ${updatedEvent.name}`, 
      'event_update', 
      updatedEvent._id, 
      'Event'
    );

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ 
      message: 'Error updating event', 
      error: error.message 
    });
  }
};

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

    // Create a notification for event deletion
    await createNotification(
      req.user._id, 
      `Event deleted: ${event.name}`, 
      'event_deletion', 
      event._id, 
      'Event'
    );

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

    // Create a notification for event registration
    await createNotification(
      req.user._id, 
      `Registered for event: ${event.name}`, 
      'event_registration', 
      event._id, 
      'Event'
    );

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