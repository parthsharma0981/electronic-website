const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function checkDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('--- Collections ---');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.map(c => c.name));

    console.log('\n--- Sample User ---');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({}, { password: 0 });
    console.log(JSON.stringify(user, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDb();
