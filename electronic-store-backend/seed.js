import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // ── 1. Seed Admin User ──
    const usersCol = db.collection('users');
    const existingAdmin = await usersCol.findOne({ email: 'parth' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('parth123', salt);
      await usersCol.insertOne({
        name: 'Parth',
        email: 'parth',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        theme: 'dark',
        cart: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('👤 Admin user created: parth / parth123');
    } else {
      console.log('👤 Admin user already exists');
    }

    // ── 2. Seed Products ──
    const productsCol = db.collection('products');
    const existingCount = await productsCol.countDocuments();
    if (existingCount === 0) {
      const products = [
        {
          name: 'ProBook Ultra 16"', price: 1999, originalPrice: 2499, category: 'Computing', rating: 4.8, numReviews: 342, stock: 15,
          description: 'The ultimate creator laptop. M3 Pro chip, 18-hour battery life, Liquid Retina XDR display.',
          images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600' }],
          specs: { processor: 'M3 Pro', ram: '18GB', storage: '512GB SSD', display: '16.2" Liquid Retina XDR' },
          badge: 'Best Seller',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'Quantum Phone 15 Pro', price: 1199, originalPrice: 1299, category: 'Mobile', rating: 4.9, numReviews: 1205, stock: 32,
          description: 'Titanium design. A17 Pro chip. 48MP camera system with 5x optical zoom.',
          images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600' }],
          specs: { chip: 'A17 Pro', camera: '48MP Triple', battery: '4422mAh', display: '6.7" Super Retina XDR' },
          badge: 'New',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'AirPods Max 2', price: 549, originalPrice: 599, category: 'Audio', rating: 4.7, numReviews: 876, stock: 45,
          description: 'The pinnacle of over-ear audio. H2 chip, adaptive noise cancellation, spatial audio.',
          images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' }],
          specs: { driver: '40mm', anc: 'Adaptive ANC', battery: '20 hours', connectivity: 'Bluetooth 5.3' },
          badge: 'Trending',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'Vision Watch Ultra 3', price: 799, originalPrice: 899, category: 'Wearable', rating: 4.6, numReviews: 543, stock: 20,
          description: 'The most rugged and capable smartwatch. 49mm titanium case, precision GPS, 72-hour battery.',
          images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' }],
          specs: { display: '49mm Always-On', battery: '72 hours', water: '100m WR', sensors: 'Heart rate, SpO2, Temperature' },
          badge: 'Popular',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'GameStation 6 Pro', price: 499, originalPrice: 549, category: 'Gaming', rating: 4.8, numReviews: 2104, stock: 8,
          description: 'Experience lightning speed. Custom 4nm SoC, ray tracing GPU, 1TB ultra-fast SSD.',
          images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600' }],
          specs: { gpu: 'RDNA 4', storage: '1TB NVMe', output: '8K/4K 120fps', features: 'Ray Tracing, VRR' },
          badge: 'Hot Deal',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'StudioPods Pro 3', price: 249, originalPrice: 279, category: 'Audio', rating: 4.5, numReviews: 1567, stock: 60,
          description: 'Immersive sound with adaptive transparency. Personalized spatial audio.',
          images: [{ url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=600' }],
          specs: { driver: 'Custom Apple', anc: 'Active ANC + Transparency', battery: '6h (30h with case)', fit: 'Silicone tips' },
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'UltraTab Pro 12.9"', price: 1099, originalPrice: 1199, category: 'Mobile', rating: 4.7, numReviews: 689, stock: 18,
          description: 'The ultimate canvas. M2 chip, Tandem OLED display, Pencil Pro support.',
          images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600' }],
          specs: { chip: 'M2', display: '12.9" Tandem OLED', storage: '256GB-2TB', connectivity: 'WiFi 6E' },
          badge: "Editor's Pick",
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'MagSafe Charging Dock', price: 129, originalPrice: 149, category: 'Accessories', rating: 4.4, numReviews: 312, stock: 100,
          description: '3-in-1 charging station for your phone, watch, and earbuds.',
          images: [{ url: 'https://images.unsplash.com/photo-1625205030752-46fa0cdff24c?auto=format&fit=crop&q=80&w=600' }],
          specs: { output: '15W wireless', compatibility: 'MagSafe, Qi2', ports: 'USB-C input', material: 'Aluminum + Silicone' },
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'AirDesk Pro 27"', price: 1599, originalPrice: 1799, category: 'Computing', rating: 4.9, numReviews: 234, stock: 12,
          description: "The world's best desktop display. 5K Retina, P3 wide color, 600 nits brightness.",
          images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' }],
          specs: { resolution: '5120x2880', brightness: '600 nits', color: 'P3 Wide Color', connection: 'Thunderbolt 4' },
          badge: 'Premium',
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'CyberBand Fitness', price: 79, originalPrice: 99, category: 'Wearable', rating: 4.3, numReviews: 1890, stock: 200,
          description: 'Track your health 24/7. Heart rate, sleep, SpO2, stress monitoring. 14-day battery.',
          images: [{ url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600' }],
          specs: { display: '1.62" AMOLED', battery: '14 days', water: '5ATM', sensors: 'HR, SpO2, Accelerometer' },
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'ProController Elite', price: 179, originalPrice: 199, category: 'Gaming', rating: 4.6, numReviews: 456, stock: 35,
          description: 'Pro-grade wireless controller with Hall-effect sticks, adjustable triggers, and 40-hour battery.',
          images: [{ url: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=600' }],
          specs: { connectivity: 'Bluetooth 5.2 + USB-C', battery: '40 hours', features: 'Hall-effect sticks, RGB', compatibility: 'PC, Console, Mobile' },
          createdAt: new Date(), updatedAt: new Date(),
        },
        {
          name: 'ThunderHub USB-C Dock', price: 199, originalPrice: 249, category: 'Accessories', rating: 4.5, numReviews: 178, stock: 55,
          description: '12-in-1 USB-C hub with dual HDMI, 100W PD, SD card, ethernet.',
          images: [{ url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=600' }],
          specs: { ports: '12 total', video: 'Dual HDMI 4K60', power: '100W PD passthrough', data: 'USB 3.2 Gen2 10Gbps' },
          createdAt: new Date(), updatedAt: new Date(),
        },
      ];

      await productsCol.insertMany(products);
      console.log(`📱 ${products.length} products seeded`);
    } else {
      console.log(`📱 Products already exist (${existingCount})`);
    }

    // ── 3. Seed Categories ──
    const categoriesCol = db.collection('categories');
    const catCount = await categoriesCol.countDocuments();
    if (catCount === 0) {
      const categories = [
        { name: 'Computing', icon: '💻', label: 'Laptops & Desktops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600' },
        { name: 'Mobile', icon: '📱', label: 'Smartphones & Tablets', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
        { name: 'Audio', icon: '🎧', label: 'Headphones & Speakers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
        { name: 'Wearable', icon: '⌚', label: 'Smartwatches & Bands', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
        { name: 'Gaming', icon: '🎮', label: 'Consoles & Accessories', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600' },
        { name: 'Accessories', icon: '🔌', label: 'Cables, Cases & More', image: 'https://images.unsplash.com/photo-1625205030752-46fa0cdff24c?auto=format&fit=crop&q=80&w=600' },
      ];
      await categoriesCol.insertMany(categories);
      console.log(`📦 ${categories.length} categories seeded`);
    } else {
      console.log(`📦 Categories already exist (${catCount})`);
    }

    // ── Final Summary ──
    console.log('\n✅ Seed complete!');
    console.log(`   Users:      ${await usersCol.countDocuments()}`);
    console.log(`   Products:   ${await productsCol.countDocuments()}`);
    console.log(`   Categories: ${await categoriesCol.countDocuments()}`);
    console.log(`   Orders:     ${await db.collection('orders').countDocuments()}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
