const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function makeAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }, { strict: false }));
    const result = await User.updateOne({ email: 'parthsharma0981@gmail.com' }, { $set: { role: 'admin' } });
    console.log('MIGRATION_RESULT: ' + JSON.stringify(result));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

makeAdmin();
