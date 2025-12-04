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
  // July 2025
  {
    title: "Orientation Program for I Semester",
    description: "Welcome orientation program for all first semester BCA students. Learn about college culture, facilities, and academic expectations.",
    date: new Date("2025-07-30"),
    time: "9:00 AM - 4:00 PM",
    venue: "Main Auditorium",
    category: "academic",
    maxParticipants: 200,
    isActive: true
  },
  // August 2025
  {
    title: "College Reopening - III & V Semester",
    description: "Official reopening of college for third and fifth semester students. Regular classes commence.",
    date: new Date("2025-08-04"),
    time: "9:00 AM",
    venue: "All Classrooms",
    category: "academic",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Outbound Program",
    description: "Adventure and team-building outbound program for first-year students. Includes outdoor activities and workshops.",
    date: new Date("2025-08-10"),
    time: "7:00 AM - 6:00 PM",
    venue: "Offsite Location",
    category: "cultural",
    maxParticipants: 150,
    isActive: true
  },
  {
    title: "Independence Day Celebration",
    description: "Celebrate India's Independence Day with flag hoisting, cultural programs, and patriotic performances.",
    date: new Date("2025-08-15"),
    time: "8:00 AM - 12:00 PM",
    venue: "College Ground",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Investiture Ceremony & Freshers Day",
    description: "Official investiture ceremony for student council followed by Freshers Day celebrations. Welcome the new batch with performances and fun activities.",
    date: new Date("2025-08-20"),
    time: "10:00 AM - 5:00 PM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  {
    title: "Ganesha Chaturthi Celebration",
    description: "Celebrate Ganesha Chaturthi with pooja, cultural programs, and festivities.",
    date: new Date("2025-08-27"),
    time: "10:00 AM - 1:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  // September 2025
  {
    title: "Eid-Milad Celebration",
    description: "Celebration of Eid-Milad with cultural harmony and community gathering.",
    date: new Date("2025-09-05"),
    time: "11:00 AM - 1:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "First Internal Assessment (IA)",
    description: "First Internal Assessment examinations for all semesters. Prepare well and give your best!",
    date: new Date("2025-09-11"),
    time: "10:00 AM - 1:00 PM",
    venue: "Examination Halls",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "First IA Result Display & Inhouse Fest",
    description: "Display of First IA results followed by exciting Inhouse Fest with competitions, games, and cultural performances.",
    date: new Date("2025-09-27"),
    time: "9:00 AM - 5:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  // October 2025
  {
    title: "Vijayadashami Celebration",
    description: "Celebrate Vijayadashami - the festival of victory of good over evil.",
    date: new Date("2025-10-01"),
    time: "10:00 AM - 12:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Gandhi Jayanthi",
    description: "Commemorate the birth anniversary of Mahatma Gandhi with special programs and activities promoting peace and non-violence.",
    date: new Date("2025-10-02"),
    time: "9:00 AM - 11:00 AM",
    venue: "Main Auditorium",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Maharshi Valmiki Jayanthi",
    description: "Celebration of Maharshi Valmiki Jayanthi with cultural programs.",
    date: new Date("2025-10-07"),
    time: "10:00 AM - 12:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Second Internal Assessment (IA)",
    description: "Second Internal Assessment examinations for all semesters.",
    date: new Date("2025-10-13"),
    time: "10:00 AM - 1:00 PM",
    venue: "Examination Halls",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Naraka Chaturdashi",
    description: "Celebration of Naraka Chaturdashi - the day before Deepavali.",
    date: new Date("2025-10-20"),
    time: "10:00 AM - 12:00 PM",
    venue: "College Premises",
    category: "cultural",
    maxParticipants: 300,
    isActive: true
  },
  {
    title: "Balipadyami & Deepavali Celebration",
    description: "Grand Deepavali celebration with rangoli competition, lamp lighting, and festive activities.",
    date: new Date("2025-10-22"),
    time: "10:00 AM - 2:00 PM",
    venue: "College Campus",
    category: "cultural",
    maxParticipants: 400,
    isActive: true
  },
  // November 2025
  {
    title: "Kannada Rajyothsava & PUC Fest",
    description: "Celebrate Karnataka Formation Day with cultural programs showcasing Kannada heritage. Combined with PUC Fest activities.",
    date: new Date("2025-11-01"),
    time: "9:00 AM - 5:00 PM",
    venue: "Main Auditorium & Campus",
    category: "cultural",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Kanakadasa Jayanthi",
    description: "Commemorate the birth anniversary of Saint Kanakadasa with devotional programs.",
    date: new Date("2025-11-08"),
    time: "10:00 AM - 12:00 PM",
    venue: "Seminar Hall",
    category: "cultural",
    maxParticipants: 200,
    isActive: true
  },
  {
    title: "Makeup IA Week",
    description: "Makeup Internal Assessment for students who missed regular IA examinations.",
    date: new Date("2025-11-03"),
    time: "10:00 AM - 1:00 PM",
    venue: "Examination Halls",
    category: "academic",
    maxParticipants: 100,
    isActive: true
  },
  {
    title: "Third Internal Assessment (IA)",
    description: "Third and final Internal Assessment examinations for all semesters.",
    date: new Date("2025-11-17"),
    time: "10:00 AM - 1:00 PM",
    venue: "Examination Halls",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Second IA Result Display",
    description: "Display of Second Internal Assessment results.",
    date: new Date("2025-11-30"),
    time: "10:00 AM",
    venue: "Notice Boards & Online Portal",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  },
  {
    title: "Last Working Day - Odd Semester",
    description: "Last working day of the odd semester. Farewell activities and semester wrap-up.",
    date: new Date("2025-11-29"),
    time: "9:00 AM - 4:00 PM",
    venue: "College Campus",
    category: "academic",
    maxParticipants: 500,
    isActive: true
  }
];

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    await Event.insertMany(events);
    console.log(`Successfully added ${events.length} events!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
