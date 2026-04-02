const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function testQuery() {
  try {
    await mongoose.connect(MONGO_URI);
    const userSchema = new mongoose.Schema({
      email: { type: String, lowercase: true }
    }, { strict: false });
    const User = mongoose.model('UserTest', userSchema, 'users');
    
    const emailToTest = 'parthsharma0981@gmail.com';
    const upperEmail = 'ParthSharma0981@gmail.com';
    
    console.log('Searching for lowercase:', emailToTest);
    const u1 = await User.findOne({ email: emailToTest });
    console.log('Found:', !!u1);
    
    console.log('Searching for uppercase:', upperEmail);
    const u2 = await User.findOne({ email: upperEmail });
    console.log('Found:', !!u2);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testQuery();
