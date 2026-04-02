import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Place order directly (COD / demo — no Razorpay)
// @route   POST /api/orders/direct
// @access  Protected
export const placeOrderDirect = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalAmount, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalAmount,
    payment: {
      isPaid: paymentMethod === 'cod' ? false : true,
      paidAt: paymentMethod === 'cod' ? undefined : Date.now(),
    },
    status: 'Pending',
  });

  // Reduce stock & increment sales
  for (const item of orderItems) {
    if (item.product) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, salesCount: item.quantity } });
    }
  }

  res.status(201).json(order);
});
