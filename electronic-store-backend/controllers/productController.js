import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// Helper to dynamically calculate badge if no manual override exists
const computeBadge = (product) => {
  if (product.badge && product.badge.trim() !== '') return product.badge;

  const sales = product.salesCount || 0;
  if (sales >= 5) return 'Best Seller';

  if (product.originalPrice && product.originalPrice > product.price) return 'Sale';

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  if (new Date(product.createdAt) > fourteenDaysAgo) return 'New';

  return null;
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sort, search, page = 1, limit = 50 } = req.query;

  const query = { isAvailable: { $ne: false } };

  if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'lowToHigh': { price: 1 },
    'highToLow': { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  const sortBy = sortOptions[sort] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  const formattedProducts = products.map(p => {
    const obj = p.toObject();
    obj.badge = computeBadge(obj);
    return obj;
  });

  res.json({
    products: formattedProducts,
    page: Number(page),
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const obj = product.toObject();
  obj.badge = computeBadge(obj);
  res.json(obj);
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin or Seller
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, badge, specs, stock, tags, images, imageUrl } = req.body;

  // Support both multipart file uploads and JSON image URLs
  let productImages = [];
  if (req.files && req.files.length > 0) {
    productImages = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
  } else if (images && Array.isArray(images)) {
    productImages = images.map(img => typeof img === 'string' ? { url: img } : img);
  } else if (imageUrl) {
    productImages = [{ url: imageUrl }];
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    category,
    badge,
    specs: specs || {},
    stock: stock ? Number(stock) : 10,
    tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
    images: productImages.length > 0 ? productImages : [{ url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=600' }],
    seller: req.user._id,
  });

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin or Seller
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, originalPrice, category, badge, specs, stock, tags, isAvailable } = req.body;

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
  product.category = category || product.category;
  product.badge = badge !== undefined ? badge : product.badge;
  product.specs = specs || product.specs;
  product.stock = stock !== undefined ? Number(stock) : product.stock;
  product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;
  if (tags) product.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
});

// @desc    Delete product image
// @route   DELETE /api/products/:id/image/:publicId
// @access  Admin
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const publicId = decodeURIComponent(req.params.publicId);
  product.images = product.images.filter((img) => img.public_id !== publicId);
  await product.save();

  res.json({ message: 'Image deleted' });
});

// @desc    Get top selling products
// @route   GET /api/products/top-sellers
// @access  Public
export const getTopSellers = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;

  // Real Top Sellers by salesCount
  const products = await Product.find({ isAvailable: { $ne: false } })
    .sort({ salesCount: -1, numReviews: -1, createdAt: -1 })
    .limit(limit);

  res.json(products.map(p => {
    const obj = p.toObject();
    obj.badge = computeBadge(obj);
    return { ...obj, totalSold: obj.salesCount || 0, totalOrders: obj.salesCount || 0 };
  }));
});