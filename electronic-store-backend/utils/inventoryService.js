import Product from '../models/Product.js';
import { sendEmail } from './sendEmail.js';
import { lowStockAlertTpl } from './emailTemplates.js';

const LOW_STOCK_THRESHOLD = 5;

/**
 * Check for low-stock products and email admin.
 * Called after an order is placed.
 */
export const checkLowStock = async () => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: LOW_STOCK_THRESHOLD, $gte: 0 },
      isAvailable: { $ne: false },
    }).select('name stock category price');

    if (lowStockProducts.length === 0) return;

    console.log(`⚠️  ${lowStockProducts.length} product(s) with low stock detected`);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    try {
      await sendEmail({
        to:      adminEmail,
        subject: `🚨 Low Stock Alert — ${lowStockProducts.length} product(s) need restock`,
        html:    lowStockAlertTpl(lowStockProducts),
      });
    } catch (err) {
      console.error('Low stock email failed:', err.message);
    }
  } catch (err) {
    console.error('Inventory check failed:', err.message);
  }
};
