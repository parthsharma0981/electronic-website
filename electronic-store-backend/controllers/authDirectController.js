import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Direct registration — no OTP, no email verification
export const registerDirect = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'seller' ? 'seller' : 'user',
    isEmailVerified: true,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: true,
    cart: [],
    wishlist: [],
    theme: 'dark',
    token: generateToken(user._id),
  });
});
