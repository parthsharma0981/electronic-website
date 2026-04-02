import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, trim: true },
    badge: { type: String, trim: true },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],
    stock: { type: Number, default: 10, min: 0 },
    salesCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    tags: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
