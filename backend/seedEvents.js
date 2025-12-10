const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  category: String,
  maxParticipants: Number,
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: Boolean
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

const events = [
  // ==================== JANUARY 2025 ====================
  {
    title: "New Year Celebration",
    description: "Welcome 2025 with joy and enthusiasm! Cultural performances, games, and new year resolutions board.",
    date: new Date(2025, 0, 1),
    time: "10:00 AM - 12:00 PM",
    venue: "College Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "National Youth Day",
    description: "Celebrate Swami Vivekananda Jayanthi with inspirational talks, debates, and youth-centric activities.",
    date: new Date(2025, 0, 12),
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Republic Day Celebration",
    description: "Celebrate India's 76th Republic Day with flag hoisting, parade, cultural programs, and patriotic performances.",
    date: new Date(2025, 0, 26),
    time: "8:00 AM - 12:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },

  // ==================== FEBRUARY 2025 ====================
  {
    title: "Tech Fest 2025",
    description: "Annual Technical Festival featuring coding competitions, hackathons, robotics, project exhibitions, and tech talks.",
    date: new Date(2025, 1, 7),
    time: "9:00 AM - 5:00 PM",
    venue: "College Campus",
    category: "technical",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Hackathon - Code24",
    description: "24-hour coding marathon. Build innovative solutions, win exciting prizes! Teams of 2-4 members.",
    date: new Date(2025, 1, 8),
    time: "9:00 AM (24 hours)",
    venue: "Computer Labs",
    category: "technical",
    maxParticipants: 100,
    isActive: true
  },
  {
    title: "Rose Day & Friendship Week",
    description: "Celebrate Rose Day with fun activities, gift exchanges, and friendship bonding events.",
    date: new Date(2025, 1, 7),
    time: "11:00 AM - 2:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },

  // ==================== MARCH 2025 ====================
  {
    title: "International Women's Day",
    description: "Celebrate women achievers with inspiring talks, felicitation ceremony, and cultural programs.",
    date: new Date(2025, 2, 8),
    time: "10:00 AM - 1:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Holi Celebration",
    description: "Festival of colors! Celebrate Holi with organic colors, music, dance, and traditional sweets.",
    date: new Date(2025, 2, 14),
    time: "10:00 AM - 1:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Ugadi Celebration",
    description: "Celebrate Kannada New Year with traditional programs, Panchanga Shravana, and cultural events.",
    date: new Date(2025, 2, 30),
    time: "10:00 AM - 12:00 PM",
    venue: "College Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },

  // ==================== APRIL 2025 ====================
  {
    title: "Annual Sports Meet 2025",
    description: "Inter-class sports competition. Events include athletics, cricket, volleyball, badminton, chess, and more!",
    date: new Date(2025, 3, 5),
    time: "8:00 AM - 5:00 PM",
    venue: "Sports Ground",
    category: "sports",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Sports Meet Finals & Prize Distribution",
    description: "Finals and closing ceremony of Annual Sports Meet with prize distribution.",
    date: new Date(2025, 3, 6),
    time: "8:00 AM - 5:00 PM",
    venue: "Sports Ground",
    category: "sports",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Ambedkar Jayanthi",
    description: "Commemorate Dr. B.R. Ambedkar's birth anniversary with special programs and tribute.",
    date: new Date(2025, 3, 14),
    time: "10:00 AM - 12:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Annual Day & Cultural Fest",
    description: "Grand Annual Day celebration with cultural performances, prize distribution, and chief guest address.",
    date: new Date(2025, 3, 26),
    time: "4:00 PM - 9:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 600,
    isActive: true
  },

  // ==================== MAY 2025 ====================
  {
    title: "Project Exhibition",
    description: "Final year project exhibition. Showcase your innovative projects to industry experts and faculty.",
    date: new Date(2025, 4, 3),
    time: "10:00 AM - 4:00 PM",
    venue: "Exhibition Hall",
    category: "technical",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Farewell Party - VI Semester",
    description: "Bid farewell to outgoing VI semester students with performances, memories, and best wishes.",
    date: new Date(2025, 4, 17),
    time: "3:00 PM - 7:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },

  // ==================== JUNE 2025 ====================
  {
    title: "Summer Internship Program",
    description: "Optional summer internship program for interested students. Industry exposure and practical learning.",
    date: new Date(2025, 5, 2),
    time: "9:00 AM - 5:00 PM",
    venue: "Partner Companies",
    category: "technical",
    maxParticipants: 50,
    isActive: true
  },
  {
    title: "Workshop: Web Development Bootcamp",
    description: "5-day intensive web development workshop. Learn HTML, CSS, JavaScript, and React basics.",
    date: new Date(2025, 5, 16),
    time: "10:00 AM - 4:00 PM",
    venue: "Computer Lab",
    category: "workshop",
    maxParticipants: 60,
    isActive: true
  },

  // ==================== JULY 2025 ====================
  {
    title: "Orientation Program for I Semester",
    description: "Welcome orientation program for all first semester BCA students. Learn about college culture, facilities, and academic expectations.",
    date: new Date(2025, 6, 30),
    time: "9:00 AM - 4:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },

  // ==================== AUGUST 2025 ====================
  {
    title: "Outbound Program for First Year",
    description: "Adventure and team-building outbound program for first-year students. Includes outdoor activities, workshops, and fun games.",
    date: new Date(2025, 7, 10),
    time: "7:00 AM - 6:00 PM",
    venue: "Offsite Location",
    category: "cultural",
    maxParticipants: 150,
    isActive: true
  },
  {
    title: "Independence Day Celebration",
    description: "Celebrate India's 79th Independence Day with flag hoisting, cultural programs, and patriotic performances.",
    date: new Date(2025, 7, 15),
    time: "8:00 AM - 12:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Investiture Ceremony & Freshers Day",
    description: "Official investiture ceremony for student council followed by grand Freshers Day celebrations. Welcome the new batch!",
    date: new Date(2025, 7, 20),
    time: "10:00 AM - 5:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Ganesha Chaturthi Celebration",
    description: "Celebrate Ganesha Chaturthi with pooja, cultural programs, and festivities on campus.",
    date: new Date(2025, 7, 27),
    time: "10:00 AM - 1:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },

  // ==================== SEPTEMBER 2025 ====================
  {
    title: "Teacher's Day Celebration",
    description: "Honor our beloved teachers with performances, gratitude cards, and special cultural programs.",
    date: new Date(2025, 8, 5),
    time: "10:00 AM - 1:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Inhouse Fest 2025",
    description: "Grand Inhouse Fest with competitions, games, cultural performances, and exciting prizes!",
    date: new Date(2025, 8, 27),
    time: "9:00 AM - 5:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },

  // ==================== OCTOBER 2025 ====================
  {
    title: "Vijayadashami Celebration",
    description: "Celebrate Vijayadashami - the festival of victory of good over evil with cultural programs.",
    date: new Date(2025, 9, 1),
    time: "10:00 AM - 12:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Gandhi Jayanthi",
    description: "Commemorate the birth anniversary of Mahatma Gandhi with special programs promoting peace and non-violence.",
    date: new Date(2025, 9, 2),
    time: "9:00 AM - 11:00 AM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Maharshi Valmiki Jayanthi",
    description: "Celebration of Maharshi Valmiki Jayanthi with cultural programs and speeches.",
    date: new Date(2025, 9, 7),
    time: "10:00 AM - 12:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Naraka Chaturdashi",
    description: "Celebration of Naraka Chaturdashi - the day before Deepavali with traditional rituals.",
    date: new Date(2025, 9, 20),
    time: "10:00 AM - 12:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Balipadyami & Deepavali Celebration",
    description: "Grand Deepavali celebration with rangoli competition, lamp lighting, sweets distribution, and festive activities.",
    date: new Date(2025, 9, 22),
    time: "10:00 AM - 2:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },

  // ==================== NOVEMBER 2025 ====================
  {
    title: "Kannada Rajyothsava",
    description: "Celebrate Karnataka Formation Day with cultural programs showcasing rich Kannada heritage and traditions.",
    date: new Date(2025, 10, 1),
    time: "9:00 AM - 1:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "PUC Fest 2025",
    description: "Inter-college PUC Fest with various competitions, cultural events, and performances.",
    date: new Date(2025, 10, 1),
    time: "2:00 PM - 6:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Kanakadasa Jayanthi",
    description: "Commemorate the birth anniversary of Saint Kanakadasa with devotional programs and cultural events.",
    date: new Date(2025, 10, 8),
    time: "10:00 AM - 12:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },

  // ==================== DECEMBER 2025 ====================
  {
    title: "World AIDS Day Awareness",
    description: "Awareness program on HIV/AIDS with expert talks, poster exhibition, and pledge ceremony.",
    date: new Date(2025, 11, 1),
    time: "2:00 PM - 4:00 PM",
    venue: "Seminar Hall",
    category: "seminar",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Christmas Celebration",
    description: "Celebrate Christmas with carols, Secret Santa, decoration competition, and festive cheer!",
    date: new Date(2025, 11, 24),
    time: "11:00 AM - 2:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },

  // ==================== JANUARY 2026 ====================
  {
    title: "New Year Celebration 2026",
    description: "Welcome 2026 with joy! Cultural performances, games, and new year resolutions board.",
    date: new Date(2026, 0, 1),
    time: "10:00 AM - 12:00 PM",
    venue: "College Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Even Semester 2026 Begins",
    description: "College reopens for even semester. Regular classes commence for II, IV, and VI semester.",
    date: new Date(2026, 0, 5),
    time: "9:00 AM",
    venue: "All Classrooms",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "National Youth Day 2026",
    description: "Celebrate Swami Vivekananda Jayanthi with inspirational talks and debates.",
    date: new Date(2026, 0, 12),
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Republic Day Celebration 2026",
    description: "Celebrate India's 77th Republic Day with flag hoisting, parade, and cultural programs.",
    date: new Date(2026, 0, 26),
    time: "8:00 AM - 12:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },

  // ==================== FEBRUARY 2026 ====================
  {
    title: "Tech Fest 2026",
    description: "Annual Technical Festival with coding competitions, hackathons, and project exhibitions.",
    date: new Date(2026, 1, 6),
    time: "9:00 AM - 5:00 PM",
    venue: "College Campus",
    category: "technical",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Valentine's Week Celebration",
    description: "Rose Day, Friendship Day activities with fun events and gift exchanges.",
    date: new Date(2026, 1, 7),
    time: "11:00 AM - 2:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },

  // ==================== MARCH 2026 ====================
  {
    title: "International Women's Day 2026",
    description: "Celebrate women achievers with inspiring talks and cultural programs.",
    date: new Date(2026, 2, 8),
    time: "10:00 AM - 1:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Holi Celebration 2026",
    description: "Festival of colors! Celebrate with organic colors, music, dance, and sweets.",
    date: new Date(2026, 2, 3),
    time: "10:00 AM - 1:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },

  // ==================== APRIL 2026 ====================
  {
    title: "Annual Sports Meet 2026",
    description: "Inter-class sports competition with athletics, cricket, volleyball, and more!",
    date: new Date(2026, 3, 4),
    time: "8:00 AM - 5:00 PM",
    venue: "Sports Ground",
    category: "sports",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Annual Day 2026",
    description: "Grand Annual Day celebration with cultural performances and prize distribution.",
    date: new Date(2026, 3, 25),
    time: "4:00 PM - 9:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 600,
    isActive: true
  },

  // ==================== MAY 2026 ====================
  {
    title: "Project Exhibition 2026",
    description: "Final year project exhibition showcasing innovative projects to industry experts.",
    date: new Date(2026, 4, 2),
    time: "10:00 AM - 4:00 PM",
    venue: "Exhibition Hall",
    category: "technical",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Farewell Party 2026",
    description: "Bid farewell to outgoing students with performances and memories.",
    date: new Date(2026, 4, 16),
    time: "3:00 PM - 7:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Event.deleteMany({});
    console.log('Cleared existing events');

    const inserted = await Event.insertMany(events);
    console.log(`\n✅ Successfully added ${inserted.length} events!\n`);
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const grouped = {};
    inserted.forEach(e => {
      const month = new Date(e.date).getMonth();
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(e.title);
    });
    
    Object.keys(grouped).sort((a, b) => a - b).forEach(month => {
      console.log(`📅 ${months[month]} 2025 (${grouped[month].length} events)`);
    });

    console.log('\n🎉 All events seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
