const Event = require('../models/event.model');

// Helper function to check if user can edit any event
const canEditAnyEvent = (user) => {
  return user.isAdmin || ['hod', 'ac'].includes(user.primaryRole) || user.secondaryRoles.some(role => ['hod', 'ac'].includes(role));
};

// Helper function to check if user can create events
const canCreateEvent = (user) => {
  return user.isAdmin || ['ac', 'hod', 'teacher'].includes(user.primaryRole) || 
         (user.primaryRole === 'student' && user.isLeader) ||
         user.secondaryRoles.some(role => ['ac', 'hod', 'teacher'].includes(role));
};

exports.createEvent = async (req, res) => {
  try {
    if (!canCreateEvent(req.user)) {
      return res.status(403).json({ message: 'You do not have permission to create events' });
    }

    const { name, prize, entryFee, entryType, imageUrl } = req.body;

    if (!name || !prize || !entryFee || !entryType) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const event = new Event({
      name,
      prize,
      entryFee,
      entryType,
      imageUrl,
      createdBy: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString() && !canEditAnyEvent(req.user)) {
      return res.status(403).json({ message: 'You do not have permission to update this event' });
    }

    const { name, prize, entryFee, entryType, imageUrl } = req.body;
    event.name = name || event.name;
    event.prize = prize || event.prize;
    event.entryFee = entryFee || event.entryFee;
    event.entryType = entryType || event.entryType;
    event.imageUrl = imageUrl || event.imageUrl;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.createdBy.toString() !== req.user._id.toString() && !canEditAnyEvent(req.user)) {
      return res.status(403).json({ message: 'You do not have permission to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    if (req.user.primaryRole !== 'student') {
      return res.status(403).json({ message: 'Only students can register for events' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const alreadyRegistered = event.registrations.includes(req.user._id);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    event.registrations.push(req.user._id);
    await event.save();

    res.status(200).json({ message: 'Registration successful', event });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ message: 'Error registering for the event', error: error.message });
  }
};

exports.getRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({ registrations: req.user._id });

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json({ message: 'Registered events fetched successfully', events });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ message: 'Error fetching registered events', error: error.message });
  }
};