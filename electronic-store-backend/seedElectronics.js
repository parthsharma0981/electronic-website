import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const PRODUCTS = [
  {
    name: 'ProBook Ultra 16"', price: 1999, originalPrice: 2499, category: 'Computing', rating: 4.8, numReviews: 342, stock: 15,
    description: 'The ultimate creator laptop. M3 Pro chip, 18-hour battery life, Liquid Retina XDR display.',
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600' }],
    specs: { processor: 'M3 Pro', ram: '18GB', storage: '512GB SSD', display: '16.2" Liquid Retina XDR' },
    badge: 'Best Seller',
  },
  {
    name: 'Quantum Phone 15 Pro', price: 1199, originalPrice: 1299, category: 'Mobile', rating: 4.9, numReviews: 1205, stock: 32,
    description: 'Titanium design. A17 Pro chip. 48MP camera system with 5x optical zoom.',
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600' }],
    specs: { chip: 'A17 Pro', camera: '48MP Triple', battery: '4422mAh', display: '6.7" Super Retina XDR' },
    badge: 'New',
  },
  {
    name: 'AirPods Max 2', price: 549, originalPrice: 599, category: 'Audio', rating: 4.7, numReviews: 876, stock: 45,
    description: 'The pinnacle of over-ear audio. H2 chip, adaptive noise cancellation, spatial audio.',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' }],
    specs: { driver: '40mm', anc: 'Adaptive ANC', battery: '20 hours', connectivity: 'Bluetooth 5.3' },
    badge: 'Trending',
  },
  {
    name: 'Vision Watch Ultra 3', price: 799, originalPrice: 899, category: 'Wearable', rating: 4.6, numReviews: 543, stock: 20,
    description: 'The most rugged and capable smartwatch. 49mm titanium case, precision GPS.',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' }],
    specs: { display: '49mm Always-On', battery: '72 hours', water: '100m WR', sensors: 'Heart rate, SpO2' },
    badge: 'Popular',
  },
  {
    name: 'GameStation 6 Pro', price: 499, originalPrice: 549, category: 'Gaming', rating: 4.8, numReviews: 2104, stock: 8,
    description: 'Experience lightning speed. Custom 4nm SoC, ray tracing GPU, 1TB ultra-fast SSD.',
    images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600' }],
    specs: { gpu: 'RDNA 4', storage: '1TB NVMe', output: '8K/4K 120fps', features: 'Ray Tracing, VRR' },
    badge: 'Hot Deal',
  },
  {
    name: 'StudioPods Pro 3', price: 249, originalPrice: 279, category: 'Audio', rating: 4.5, numReviews: 1567, stock: 60,
    description: 'Immersive sound with adaptive transparency. Personalized spatial audio.',
    images: [{ url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=600' }],
    specs: { driver: 'Custom Apple', anc: 'Active ANC + Transparency', battery: '6h (30h with case)', fit: 'Silicone tips (XS-L)' },
  },
  {
    name: 'UltraTab Pro 12.9"', price: 1099, originalPrice: 1199, category: 'Mobile', rating: 4.7, numReviews: 689, stock: 18,
    description: 'The ultimate canvas. M2 chip, Tandem OLED display, Pencil Pro support.',
    images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600' }],
    specs: { chip: 'M2', display: '12.9" Tandem OLED', storage: '256GB-2TB', connectivity: 'WiFi 6E' },
    badge: "Editor's Pick",
  },
  {
    name: 'MagSafe Charging Dock', price: 129, originalPrice: 149, category: 'Accessories', rating: 4.4, numReviews: 312, stock: 100,
    description: '3-in-1 charging station for your phone, watch, and earbuds.',
    images: [{ url: 'https://images.unsplash.com/photo-1625205030752-46fa0cdff24c?auto=format&fit=crop&q=80&w=600' }],
    specs: { output: '15W wireless', compatibility: 'MagSafe, Qi2', ports: 'USB-C input', material: 'Aluminum' },
  },
  {
    name: 'AirDesk Pro 27"', price: 1599, originalPrice: 1799, category: 'Computing', rating: 4.9, numReviews: 234, stock: 12,
    description: "The world's best desktop display. 5K Retina, P3 wide color, 600 nits brightness.",
    images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' }],
    specs: { resolution: '5120x2880', brightness: '600 nits', color: 'P3 Wide Color', connection: 'Thunderbolt 4' },
    badge: 'Premium',
  },
  {
    name: 'CyberBand Fitness', price: 79, originalPrice: 99, category: 'Wearable', rating: 4.3, numReviews: 1890, stock: 200,
    description: 'Track your health 24/7. Heart rate, sleep, SpO2, stress monitoring.',
    images: [{ url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600' }],
    specs: { display: '1.62" AMOLED', battery: '14 days', water: '5ATM', sensors: 'HR, SpO2' },
  },
  {
    name: 'ProController Elite', price: 179, originalPrice: 199, category: 'Gaming', rating: 4.6, numReviews: 456, stock: 35,
    description: 'Pro-grade wireless controller with Hall-effect sticks, adjustable triggers.',
    images: [{ url: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=600' }],
    specs: { connectivity: 'Bluetooth 5.2 + USB-C', battery: '40 hours', features: 'Hall-effect sticks' },
  },
  {
    name: 'ThunderHub USB-C Dock', price: 199, originalPrice: 249, category: 'Accessories', rating: 4.5, numReviews: 178, stock: 55,
    description: '12-in-1 USB-C hub with dual HDMI, 100W PD, SD card, ethernet.',
    images: [{ url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=600' }],
    specs: { ports: '12 total', video: 'Dual HDMI 4K60', power: '100W PD', data: 'USB 3.2 Gen2' },
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    
    // Create admin user if not exists
    let admin = await User.findOne({ email: 'parth' });
    if (!admin) {
      admin = await User.create({
        name: 'Parth',
        email: 'parth',
        password: 'parth123',
        role: 'admin',
        isEmailVerified: true,
      });
      console.log('👑 Admin user created: parth / parth123');
    } else {
      console.log('👑 Admin user already exists');
    }

    // Create a demo buyer user
    let buyer = await User.findOne({ email: 'alex@ecore.com' });
    if (!buyer) {
      buyer = await User.create({
        name: 'Alex Johnson',
        email: 'alex@ecore.com',
        password: 'password123',
        role: 'user',
        isEmailVerified: true,
      });
      console.log('🛒 Buyer user created: alex@ecore.com / password123');
    }

    // Create a demo seller user
    let seller = await User.findOne({ email: 'seller@ecore.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Sarah Chen',
        email: 'seller@ecore.com',
        password: 'password123',
        role: 'seller',
        isEmailVerified: true,
      });
      console.log('🏪 Seller user created: seller@ecore.com / password123');
    }

    // Seed products
    const products = PRODUCTS.map(p => ({ ...p, seller: admin._id }));
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded!`);

    console.log('\n--- Demo Accounts ---');
    console.log('Admin:  parth / parth123');
    console.log('Buyer:  alex@ecore.com / password123');
    console.log('Seller: seller@ecore.com / password123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
