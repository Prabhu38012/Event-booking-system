const Event = require('../models/Event');

// Get all events with pagination and filtering
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 9, search, category } = req.query;
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Only show future events
    query.date = { $gte: new Date() };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create sample events (for development)
exports.createSampleEvents = async (req, res) => {
  try {
    const sampleEvents = [
      {
        title: "Summer Music Festival",
        description: "Join us for an amazing summer music festival featuring top artists from around the world. Experience live music, food trucks, and great vibes!",
        date: new Date('2025-08-15T18:00:00Z'),
        location: "Central Park, New York",
        price: 75,
        totalTickets: 1000,
        availableTickets: 850,
        category: "music",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        organizer: "Music Events Inc."
      },
      {
        title: "Tech Conference 2025",
        description: "The biggest technology conference of the year. Learn from industry leaders, network with professionals, and discover the latest innovations.",
        date: new Date('2025-09-20T09:00:00Z'),
        location: "Convention Center, San Francisco",
        price: 299,
        totalTickets: 500,
        availableTickets: 320,
        category: "technology",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        organizer: "TechWorld Events"
      },
      {
        title: "Food & Wine Festival",
        description: "Taste the finest cuisines and wines from renowned chefs and wineries. A culinary journey you won't forget!",
        date: new Date('2025-08-30T16:00:00Z'),
        location: "Downtown Plaza, Chicago",
        price: 125,
        totalTickets: 300,
        availableTickets: 180,
        category: "food",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        organizer: "Culinary Masters"
      },
      {
        title: "Championship Football Match",
        description: "Watch the most anticipated football match of the season! Experience the thrill and excitement live from the stadium.",
        date: new Date('2025-09-05T20:00:00Z'),
        location: "National Stadium, Los Angeles",
        price: 150,
        totalTickets: 2000,
        availableTickets: 1200,
        category: "sports",
        image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
        organizer: "Sports Entertainment LLC"
      },
      {
        title: "Art Exhibition Opening",
        description: "Discover contemporary art from emerging and established artists. An inspiring evening of creativity and culture.",
        date: new Date('2025-08-25T19:00:00Z'),
        location: "Modern Art Gallery, Miami",
        price: 50,
        totalTickets: 150,
        availableTickets: 90,
        category: "arts",
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
        organizer: "Contemporary Arts Foundation"
      },
      {
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas to top investors. Networking opportunities and inspiring presentations await!",
        date: new Date('2025-09-10T14:00:00Z'),
        location: "Innovation Hub, Austin",
        price: 25,
        totalTickets: 200,
        availableTickets: 150,
        category: "technology",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        organizer: "Startup Accelerator"
      }
    ];

    await Event.deleteMany({}); // Clear existing events
    const events = await Event.insertMany(sampleEvents);

    res.json({
      message: 'Sample events created successfully',
      count: events.length
    });
  } catch (error) {
    console.error('Create sample events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};