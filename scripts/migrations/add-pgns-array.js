const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    
    console.log('Connected to MongoDB');

    // Get the User model
    const User = require('../../server/models/User');

    // First, let's check if we can find any users at all
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);

    // Then check how many users don't have pgns
    const usersWithoutPgns = await User.countDocuments({ pgns: { $exists: false } });
    console.log(`Users without pgns field: ${usersWithoutPgns}`);

    // Perform migration
    const result = await User.updateMany(
      { pgns: { $exists: false } },
      { $set: { pgns: [] } }
    ).maxTimeMS(30000);

    console.log(`Migration completed. Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

migrate();