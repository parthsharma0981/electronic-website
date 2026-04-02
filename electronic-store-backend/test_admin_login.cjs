const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const MONGO_URI = 'mongodb://127.0.0.1:27017/electronic-store';

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI);
    const userSchema = new mongoose.Schema({
      email: String,
      password: { type: String, required: true }
    }, { strict: false });
    
    // Manual match password
    userSchema.methods.matchPassword = async function (pwd) {
      return bcrypt.compare(pwd, this.password);
    };
    
    const User = mongoose.model('UserLoginTest', userSchema, 'users');
    
    const email = 'parth'; // admin user
    const pass  = 'parth123';
    
    console.log('Searching for:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('USER_NOT_FOUND');
      process.exit(0);
    }
    
    console.log('User found. Matching password...');
    const isMatch = await user.matchPassword(pass);
    console.log('Match result:', isMatch);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testLogin();
