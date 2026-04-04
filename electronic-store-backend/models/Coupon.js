import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType:  { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrder:      { type: Number, default: 0 },
    maxDiscount:   { type: Number, default: null },  // cap for percentage discounts
    expiresAt:     { type: Date, required: true },
    usageLimit:    { type: Number, default: null },   // null = unlimited
    usedCount:     { type: Number, default: 0 },
    isActive:      { type: Boolean, default: true },
    description:   { type: String, default: '' },
  },
  { timestamps: true }
);

couponSchema.methods.isValid = function (orderTotal) {
  if (!this.isActive) return { valid: false, message: 'This coupon is no longer active' };
  if (this.expiresAt < new Date()) return { valid: false, message: 'This coupon has expired' };
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) return { valid: false, message: 'This coupon has reached its usage limit' };
  if (orderTotal < this.minOrder) return { valid: false, message: `Minimum order of $${this.minOrder} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderTotal) {
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderTotal * this.discountValue) / 100;
    if (this.maxDiscount !== null) discount = Math.min(discount, this.maxDiscount);
  } else {
    discount = this.discountValue;
  }
  return Math.min(discount, orderTotal); // never exceed order total
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
