// scripts/create-events.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Event Schema (inline to avoid import issues)
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalTickets: {
    type: Number,
    required: true,
    min: 1
  },
  availableTickets: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['music', 'sports', 'arts', 'technology', 'food', 'other']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'
  },
  organizer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

const sampleEvents = [
  {
    title: "Summer Music Festival 2025",
    description: "Join us for an amazing summer music festival featuring top artists from around the world. Experience live music, food trucks, and great vibes! This outdoor festival promises to be the highlight of your summer with multiple stages, diverse genres, and unforgettable performances.",
    date: new Date('2025-08-15T18:00:00Z'),
    location: "Central Park, New York, NY",
    price: 75,
    totalTickets: 1000,
    availableTickets: 850,
    category: "music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60",
    organizer: "Music Events Inc."
  },
  {
    title: "Tech Innovation Conference 2025",
    description: "The biggest technology conference of the year. Learn from industry leaders, network with professionals, and discover the latest innovations in AI, blockchain, and web development. Features keynote speakers from major tech companies.",
    date: new Date('2025-09-20T09:00:00Z'),
    location: "Convention Center, San Francisco, CA",
    price: 299,
    totalTickets: 500,
    availableTickets: 320,
    category: "technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    organizer: "TechWorld Events"
  },
  {
    title: "Gourmet Food & Wine Festival",
    description: "Taste the finest cuisines and wines from renowned chefs and wineries. A culinary journey you won't forget! Experience cooking demonstrations, wine tastings, and meet celebrity chefs in this ultimate foodie paradise.",
    date: new Date('2025-08-30T16:00:00Z'),
    location: "Downtown Plaza, Chicago, IL",
    price: 125,
    totalTickets: 300,
    availableTickets: 180,
    category: "food",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=60",
    organizer: "Culinary Masters"
  },
  {
    title: "Championship Football Match",
    description: "Watch the most anticipated football match of the season! Experience the thrill and excitement live from the stadium. Premium seating available with pre-game entertainment and halftime shows.",
    date: new Date('2025-09-05T20:00:00Z'),
    location: "National Stadium, Los Angeles, CA",
    price: 150,
    totalTickets: 2000,
    availableTickets: 1200,
    category: "sports",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60",
    organizer: "Sports Entertainment LLC"
  },
  {
    title: "Contemporary Art Exhibition Opening",
    description: "Discover contemporary art from emerging and established artists. An inspiring evening of creativity and culture featuring installations, paintings, and digital art from around the world.",
    date: new Date('2025-08-25T19:00:00Z'),
    location: "Modern Art Gallery, Miami, FL",
    price: 50,
    totalTickets: 150,
    availableTickets: 90,
    category: "arts",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop&q=60",
    organizer: "Contemporary Arts Foundation"
  },
  {
    title: "Startup Pitch Competition 2025",
    description: "Watch innovative startups pitch their ideas to top investors. Networking opportunities and inspiring presentations await! Connect with entrepreneurs, investors, and industry leaders.",
    date: new Date('2025-09-10T14:00:00Z'),
    location: "Innovation Hub, Austin, TX",
    price: 25,
    totalTickets: 200,
    availableTickets: 150,
    category: "technology",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60",
    organizer: "Startup Accelerator"
  },
  {
    title: "Jazz & Blues Night",
    description: "An intimate evening of smooth jazz and soulful blues featuring local and international artists. Perfect atmosphere for music lovers looking for a sophisticated night out.",
    date: new Date('2025-08-20T20:30:00Z'),
    location: "Blue Note Club, New Orleans, LA",
    price: 65,
    totalTickets: 120,
    availableTickets: 85,
    category: "music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=60",
    organizer: "Jazz Society"
  },
  {
    title: "Digital Marketing Summit",
    description: "Learn the latest digital marketing strategies from industry experts. Sessions on SEO, social media, content marketing, and analytics. Perfect for marketers and business owners.",
    date: new Date('2025-09-15T09:30:00Z'),
    location: "Business Center, Seattle, WA",
    price: 199,
    totalTickets: 300,
    availableTickets: 220,
    category: "technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    organizer: "Digital Marketing Institute"
  }
];

async function createSampleEvents() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('📝 Make sure you have a .env file with MONGODB_URI=mongodb://localhost:27017/eventbooking');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    console.log('🔄 Clearing existing events...');
    await Event.deleteMany({});
    console.log('✅ Cleared existing events');

    // Insert sample events
    console.log('🔄 Creating sample events...');
    const events = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${events.length} sample events successfully!`);

    // Display created events
    console.log('\n📋 Created Events:');
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title} - $${event.price} (${event.category})`);
    });

    console.log('\n🎉 Sample events created successfully!');
    console.log('🌐 You can now visit your frontend to see the events.');

  } catch (error) {
    console.error('❌ Error creating sample events:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.log('💡 Make sure MongoDB is running:');
      console.log('   - Start MongoDB: mongod');
      console.log('   - Or start with Homebrew: brew services start mongodb-community');
    }
    
    process.exit(1);
  } finally {
    // Close connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
    }
    process.exit(0);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  createSampleEvents();
}

module.exports = createSampleEvents;