const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function verifyDetails() {
  try {
    await mongoose.connect(MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({ email: 'parthsharma0981@gmail.com' });
    if (user) {
      console.log('isEmailVerified:', user.isEmailVerified);
      console.log('password len:', user.password ? user.password.length : 0);
      console.log('password starts with:', user.password ? user.password.substring(0, 4) : 'N/A');
    } else {
      console.log('USER_NOT_FOUND');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

verifyDetails();
