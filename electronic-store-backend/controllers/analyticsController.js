import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc  Get analytics data for admin dashboard
// @route GET /api/analytics
// @access Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // === Daily Revenue (last 30 days) ===
  const dailyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: { $ifNull: ['$totalAmount', '$totalPrice'] } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // === Top 5 Products by Sales ===
  const topProducts = await Product.find({ isAvailable: { $ne: false } })
    .sort({ salesCount: -1 })
    .limit(5)
    .select('name price salesCount category images');

  // === Category Revenue Breakdown ===
  const categoryBreakdown = await Product.aggregate([
    { $match: { isAvailable: { $ne: false } } },
    {
      $group: {
        _id: '$category',
        totalSales: { $sum: { $ifNull: ['$salesCount', 0] } },
        totalRevenue: { $sum: { $multiply: ['$price', { $ifNull: ['$salesCount', 0] }] } },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  // === Order Status Distribution ===
  const orderStatuses = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // === Summary Stats ===
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: { $ifNull: ['$totalAmount', '$totalPrice'] } } } },
  ]);
  const totalUsers = await User.countDocuments();
  const totalProductCount = await Product.countDocuments({ isAvailable: { $ne: false } });
  const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 }, isAvailable: { $ne: false } });

  // === Recent 7-day comparison ===
  const recentOrders = await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
  const previousWeek = new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
  const prevWeekOrders = await Order.countDocuments({ createdAt: { $gte: previousWeek, $lt: sevenDaysAgo } });
  const orderGrowth = prevWeekOrders > 0 ? ((recentOrders - prevWeekOrders) / prevWeekOrders * 100).toFixed(1) : 0;

  res.json({
    dailyRevenue,
    topProducts,
    categoryBreakdown,
    orderStatuses,
    summary: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalProducts: totalProductCount,
      lowStockCount,
      recentOrders,
      orderGrowth,
    },
  });
});
