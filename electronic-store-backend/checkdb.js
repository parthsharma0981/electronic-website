import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB:', process.env.MONGO_URI.split('@')[1]?.split('/')[1] || 'default');
    console.log('');

    const db = mongoose.connection.db;

    const users = await db.collection('users').find({}).toArray();
    console.log(`👤 Users (${users.length}):`);
    for (const u of users) {
      console.log(`   - ${u.name} (${u.email}) | role: ${u.role} | cart: ${u.cart?.length || 0} | wishlist: ${u.wishlist?.length || 0}`);
    }

    const products = await db.collection('products').find({}).toArray();
    console.log(`\n📱 Products (${products.length}):`);
    for (const p of products) {
      console.log(`   - ${p.name} | $${p.price} | stock: ${p.stock}`);
    }

    const orders = await db.collection('orders').find({}).toArray();
    console.log(`\n🛒 Orders (${orders.length}):`);
    for (const o of orders) {
      console.log(`   - ${o._id} | $${o.totalAmount} | status: ${o.status} | items: ${o.orderItems?.length}`);
    }

    const categories = await db.collection('categories').find({}).toArray();
    console.log(`\n📦 Categories (${categories.length}):`);
    for (const c of categories) {
      console.log(`   - ${c.name} (${c.icon})`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌', err.message);
    process.exit(1);
  }
}
checkDB();
