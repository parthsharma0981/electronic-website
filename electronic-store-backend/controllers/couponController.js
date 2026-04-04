import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';

// @desc  Validate a coupon code
// @route POST /api/coupons/validate
// @access Private
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  if (!code) { res.status(400); throw new Error('Coupon code is required'); }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) { res.status(404); throw new Error('Invalid coupon code'); }

  const validation = coupon.isValid(orderTotal || 0);
  if (!validation.valid) { res.status(400); throw new Error(validation.message); }

  const discount = coupon.calculateDiscount(orderTotal || 0);

  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    maxDiscount: coupon.maxDiscount,
    minOrder: coupon.minOrder,
    description: coupon.description,
  });
});

// @desc  Get all coupons (admin)
// @route GET /api/coupons
// @access Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc  Create a coupon (admin)
// @route POST /api/coupons
// @access Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountType, discountValue, minOrder, maxDiscount, expiresAt, usageLimit, description } = req.body;

  if (!code || !discountType || discountValue === undefined || !expiresAt) {
    res.status(400);
    throw new Error('Code, discount type, discount value, and expiry date are required');
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) { res.status(400); throw new Error('Coupon code already exists'); }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrder: minOrder || 0,
    maxDiscount: maxDiscount || null,
    expiresAt: new Date(expiresAt),
    usageLimit: usageLimit || null,
    description: description || '',
  });

  res.status(201).json(coupon);
});

// @desc  Delete a coupon (admin)
// @route DELETE /api/coupons/:id
// @access Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  await coupon.deleteOne();
  res.json({ message: 'Coupon deleted' });
});

// @desc  Toggle coupon active status (admin)
// @route PATCH /api/coupons/:id/toggle
// @access Admin
export const toggleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) { res.status(404); throw new Error('Coupon not found'); }
  coupon.isActive = !coupon.isActive;
  await coupon.save();
  res.json(coupon);
});
