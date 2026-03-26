// ═══════════════════════════════════════════════
// E-Core Electronics Store — Demo Data Layer
// ═══════════════════════════════════════════════

export const CATEGORIES = [
  { id: 'computing', name: 'Computing', icon: '💻', label: 'Laptops & Desktops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600' },
  { id: 'mobile',    name: 'Mobile',    icon: '📱', label: 'Smartphones & Tablets', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
  { id: 'audio',     name: 'Audio',     icon: '🎧', label: 'Headphones & Speakers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' },
  { id: 'wearable',  name: 'Wearable',  icon: '⌚', label: 'Smartwatches & Bands', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
  { id: 'gaming',    name: 'Gaming',    icon: '🎮', label: 'Consoles & Accessories', image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600' },
  { id: 'accessories', name: 'Accessories', icon: '🔌', label: 'Cables, Cases & More', image: 'https://images.unsplash.com/photo-1625205030752-46fa0cdff24c?auto=format&fit=crop&q=80&w=600' },
];

export const PRODUCTS = [
  {
    _id: 'p1', name: 'ProBook Ultra 16"', price: 1999, originalPrice: 2499, category: 'Computing', rating: 4.8, numReviews: 342, stock: 15,
    description: 'The ultimate creator laptop. M3 Pro chip, 18-hour battery life, Liquid Retina XDR display. Engineered for those who push the boundaries of what\'s possible.',
    images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600' }],
    specs: { processor: 'M3 Pro', ram: '18GB', storage: '512GB SSD', display: '16.2" Liquid Retina XDR' },
    badge: 'Best Seller',
  },
  {
    _id: 'p2', name: 'Quantum Phone 15 Pro', price: 1199, originalPrice: 1299, category: 'Mobile', rating: 4.9, numReviews: 1205, stock: 32,
    description: 'Titanium design. A17 Pro chip. 48MP camera system with 5x optical zoom. The most powerful smartphone ever made.',
    images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600' }],
    specs: { chip: 'A17 Pro', camera: '48MP Triple', battery: '4422mAh', display: '6.7" Super Retina XDR' },
    badge: 'New',
  },
  {
    _id: 'p3', name: 'AirPods Max 2', price: 549, originalPrice: 599, category: 'Audio', rating: 4.7, numReviews: 876, stock: 45,
    description: 'The pinnacle of over-ear audio. H2 chip, adaptive noise cancellation, spatial audio with head tracking. Up to 20 hours of listening time.',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600' }],
    specs: { driver: '40mm', anc: 'Adaptive ANC', battery: '20 hours', connectivity: 'Bluetooth 5.3' },
    badge: 'Trending',
  },
  {
    _id: 'p4', name: 'Vision Watch Ultra 3', price: 799, originalPrice: 899, category: 'Wearable', rating: 4.6, numReviews: 543, stock: 20,
    description: 'The most rugged and capable smartwatch. 49mm titanium case, precision GPS, 72-hour battery life, 100m water resistance.',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' }],
    specs: { display: '49mm Always-On', battery: '72 hours', water: '100m WR', sensors: 'Heart rate, SpO2, Temperature' },
    badge: 'Popular',
  },
  {
    _id: 'p5', name: 'GameStation 6 Pro', price: 499, originalPrice: 549, category: 'Gaming', rating: 4.8, numReviews: 2104, stock: 8,
    description: 'Experience lightning speed. Custom 4nm SoC, ray tracing GPU, 1TB ultra-fast SSD, 8K output support. Next-gen gaming starts here.',
    images: [{ url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=600' }],
    specs: { gpu: 'RDNA 4', storage: '1TB NVMe', output: '8K/4K 120fps', features: 'Ray Tracing, VRR' },
    badge: 'Hot Deal',
  },
  {
    _id: 'p6', name: 'StudioPods Pro 3', price: 249, originalPrice: 279, category: 'Audio', rating: 4.5, numReviews: 1567, stock: 60,
    description: 'Immersive sound with adaptive transparency. Personalized spatial audio and up to 6 hours listening time with active noise cancellation.',
    images: [{ url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&q=80&w=600' }],
    specs: { driver: 'Custom Apple', anc: 'Active ANC + Transparency', battery: '6h (30h with case)', fit: 'Silicone tips (XS-L)' },
  },
  {
    _id: 'p7', name: 'UltraTab Pro 12.9"', price: 1099, originalPrice: 1199, category: 'Mobile', rating: 4.7, numReviews: 689, stock: 18,
    description: 'The ultimate canvas. M2 chip, Tandem OLED display, Pencil Pro support. More powerful than most laptops.',
    images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600' }],
    specs: { chip: 'M2', display: '12.9" Tandem OLED', storage: '256GB-2TB', connectivity: 'WiFi 6E, 5G optional' },
    badge: 'Editor\'s Pick',
  },
  {
    _id: 'p8', name: 'MagSafe Charging Dock', price: 129, originalPrice: 149, category: 'Accessories', rating: 4.4, numReviews: 312, stock: 100,
    description: '3-in-1 charging station for your phone, watch, and earbuds. Fast wireless charging with perfect alignment every time.',
    images: [{ url: 'https://images.unsplash.com/photo-1625205030752-46fa0cdff24c?auto=format&fit=crop&q=80&w=600' }],
    specs: { output: '15W wireless', compatibility: 'MagSafe, Qi2', ports: 'USB-C input', material: 'Aluminum + Silicone' },
  },
  {
    _id: 'p9', name: 'AirDesk Pro 27"', price: 1599, originalPrice: 1799, category: 'Computing', rating: 4.9, numReviews: 234, stock: 12,
    description: 'The world\'s best desktop display. 5K Retina, P3 wide color, 600 nits brightness, nano-texture glass option.',
    images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' }],
    specs: { resolution: '5120x2880', brightness: '600 nits', color: 'P3 Wide Color', connection: 'Thunderbolt 4' },
    badge: 'Premium',
  },
  {
    _id: 'p10', name: 'CyberBand Fitness', price: 79, originalPrice: 99, category: 'Wearable', rating: 4.3, numReviews: 1890, stock: 200,
    description: 'Track your health 24/7. Heart rate, sleep, SpO2, stress monitoring. 14-day battery life in a slim, swimproof design.',
    images: [{ url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600' }],
    specs: { display: '1.62" AMOLED', battery: '14 days', water: '5ATM', sensors: 'HR, SpO2, Accelerometer' },
  },
  {
    _id: 'p11', name: 'ProController Elite', price: 179, originalPrice: 199, category: 'Gaming', rating: 4.6, numReviews: 456, stock: 35,
    description: 'Pro-grade wireless controller with Hall-effect sticks, adjustable triggers, and 40-hour battery life.',
    images: [{ url: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80&w=600' }],
    specs: { connectivity: 'Bluetooth 5.2 + USB-C', battery: '40 hours', features: 'Hall-effect sticks, RGB', compatibility: 'PC, Console, Mobile' },
  },
  {
    _id: 'p12', name: 'ThunderHub USB-C Dock', price: 199, originalPrice: 249, category: 'Accessories', rating: 4.5, numReviews: 178, stock: 55,
    description: '12-in-1 USB-C hub with dual HDMI, 100W PD, SD card, ethernet. One cable to rule them all.',
    images: [{ url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=600' }],
    specs: { ports: '12 total', video: 'Dual HDMI 4K60', power: '100W PD passthrough', data: 'USB 3.2 Gen2 10Gbps' },
  },
];

export const DEMO_USERS = {
  buyer: { _id: 'u1', name: 'Alex Johnson', email: 'alex@ecore.com', role: 'buyer', isEmailVerified: true, token: 'demo_buyer_token' },
  seller: { _id: 'u2', name: 'Sarah Chen', email: 'seller@ecore.com', role: 'seller', isEmailVerified: true, token: 'demo_seller_token' },
  admin: { _id: 'u3', name: 'Parth', email: 'parth', role: 'admin', isEmailVerified: true, token: 'demo_admin_token', password: 'parth123' },
};

export const DEMO_ORDERS = [
  {
    _id: 'ord1', createdAt: '2026-03-20T10:30:00Z', totalPrice: 2548, isPaid: true, isDelivered: false,
    status: 'shipped',
    trackingSteps: [
      { label: 'Order Placed', date: 'Mar 20, 10:30 AM', done: true },
      { label: 'Payment Confirmed', date: 'Mar 20, 10:31 AM', done: true },
      { label: 'Processing', date: 'Mar 20, 2:00 PM', done: true },
      { label: 'Shipped', date: 'Mar 21, 9:15 AM', done: true },
      { label: 'Out for Delivery', date: 'Expected Mar 26', done: false },
      { label: 'Delivered', date: '', done: false },
    ],
    orderItems: [
      { _id: 'oi1', name: 'ProBook Ultra 16"', quantity: 1, price: 1999, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200' },
      { _id: 'oi2', name: 'AirPods Max 2', quantity: 1, price: 549, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
    ],
  },
  {
    _id: 'ord2', createdAt: '2026-03-18T15:45:00Z', totalPrice: 1199, isPaid: true, isDelivered: true,
    status: 'delivered',
    trackingSteps: [
      { label: 'Order Placed', date: 'Mar 18, 3:45 PM', done: true },
      { label: 'Payment Confirmed', date: 'Mar 18, 3:46 PM', done: true },
      { label: 'Processing', date: 'Mar 18, 5:00 PM', done: true },
      { label: 'Shipped', date: 'Mar 19, 8:00 AM', done: true },
      { label: 'Out for Delivery', date: 'Mar 22, 7:30 AM', done: true },
      { label: 'Delivered', date: 'Mar 22, 2:15 PM', done: true },
    ],
    orderItems: [
      { _id: 'oi3', name: 'Quantum Phone 15 Pro', quantity: 1, price: 1199, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=200' },
    ],
  },
];

export const SELLER_STATS = {
  totalSales: 45320,
  totalOrders: 127,
  totalProducts: 8,
  avgRating: 4.7,
  monthlySales: [2100, 3400, 2800, 4100, 5200, 4800, 6300, 5900, 7200, 6800, 8100, 9500],
  recentOrders: [
    { id: 'so1', customer: 'Mike R.', product: 'ProBook Ultra', amount: 1999, status: 'shipped', date: '2h ago' },
    { id: 'so2', customer: 'Emma T.', product: 'AirPods Max 2', amount: 549, status: 'processing', date: '5h ago' },
    { id: 'so3', customer: 'John D.', product: 'GameStation 6', amount: 499, status: 'delivered', date: '1d ago' },
  ],
};

export const ADMIN_STATS = {
  totalUsers: 12540,
  totalRevenue: 892400,
  totalOrders: 3421,
  totalProducts: 156,
  userGrowth: [800, 1200, 1800, 2400, 3200, 4100, 5300, 6200, 7800, 9100, 10800, 12540],
  revenueByCategory: [
    { category: 'Computing', revenue: 312000 },
    { category: 'Mobile', revenue: 245000 },
    { category: 'Audio', revenue: 128000 },
    { category: 'Wearable', revenue: 98000 },
    { category: 'Gaming', revenue: 72000 },
    { category: 'Accessories', revenue: 37400 },
  ],
};

export const FAQ_DATA = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping delivers within 1-2 business days. Free shipping on orders above $200.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. Products must be in original packaging and unused condition. Refunds are processed within 5-7 business days.' },
  { q: 'Do you offer international shipping?', a: 'Yes! We ship to over 50 countries worldwide. International shipping typically takes 7-14 business days depending on destination.' },
  { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in real-time from your account dashboard under "Orders".' },
  { q: 'Is there a warranty?', a: 'All E-Core products come with a 1-year manufacturer warranty. Extended warranty plans (2-3 years) are available at checkout.' },
  { q: 'Can I sell products on E-Core?', a: 'Absolutely! Create a seller account, list your electronics products, and start selling. We handle payments and provide seller analytics.' },
];
