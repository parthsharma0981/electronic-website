const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({ email: String }, { strict: false }));
    const user = await User.findOne({ email: 'parthsharma0981@gmail.com' });
    if (user) {
      console.log('USER_FOUND: ' + JSON.stringify(user, null, 2));
    } else {
      console.log('USER_NOT_FOUND');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser();
