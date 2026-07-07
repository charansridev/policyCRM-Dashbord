const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Policy = require('./models/Policy');

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm_db';

// Get today's date in UTC at midnight
const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const mockData = [
  { name: 'Amit Sharma', phone: '9876543210', policyType: 'Jeevan Anand', amount: 5000, dueDate: today, isRecurring: true, recurringType: 'monthly' },
  { name: 'Priya Patel', phone: '8765432109', policyType: 'Money Back Policy', amount: 12000, dueDate: today, isRecurring: true, recurringType: 'yearly' },
  { name: 'Rahul Desai', phone: '7654321098', policyType: 'Jeevan Umang', amount: 3500, dueDate: today, isRecurring: true, recurringType: 'monthly' },
  { name: 'Sneha Verma', phone: '6543210987', policyType: 'Term Assurance', amount: 8000, dueDate: today, isRecurring: true, recurringType: 'yearly' },
  { name: 'Kiran Reddy', phone: '5432109876', policyType: 'Jeevan Labh', amount: 4500, dueDate: today, isRecurring: true, recurringType: 'monthly' },
  { name: 'Vikram Singh', phone: '4321098765', policyType: 'Endowment Plan', amount: 2500, dueDate: today, isRecurring: true, recurringType: 'monthly' },
  { name: 'Anita Bose', phone: '3210987654', policyType: "Children's Money Back", amount: 15000, dueDate: today, isRecurring: true, recurringType: 'yearly' },
  { name: 'Sanjay Kumar', phone: '2109876543', policyType: 'Jeevan Anand', amount: 6000, dueDate: today, isRecurring: true, recurringType: 'monthly' },
  { name: 'Pooja Mehta', phone: '1098765432', policyType: 'Money Back Policy', amount: 10000, dueDate: today, isRecurring: true, recurringType: 'yearly' },
  { name: 'Ravi Teja', phone: '9988776655', policyType: 'Jeevan Umang', amount: 4000, dueDate: today, isRecurring: true, recurringType: 'monthly' }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Policy.insertMany(mockData);
    console.log('Successfully inserted 10 mock policies for today!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
