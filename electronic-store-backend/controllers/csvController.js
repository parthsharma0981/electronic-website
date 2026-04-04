import asyncHandler from 'express-async-handler';
import { Parser } from 'json2csv';
import csvParser from 'csv-parser';
import stream from 'stream';
import Product from '../models/Product.js';

// @desc    Export all products as CSV
// @route   GET /api/admin/csv/export
// @access  Private/Admin
export const exportProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}, '-__v').lean();
  
  if (!products.length) {
    res.status(404);
    throw new Error('No products found to export');
  }

  const fields = ['_id', 'name', 'description', 'price', 'originalPrice', 'category', 'stock', 'salesCount', 'isAvailable'];
  const json2csvParser = new Parser({ fields });
  const csvStr = json2csvParser.parse(products);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=products_export.csv');
  res.status(200).send(csvStr);
});

// @desc    Import products from CSV
// @route   POST /api/admin/csv/import
// @access  Private/Admin
export const importProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No CSV file uploaded');
  }

  const results = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  let successCount = 0;
  let failCount = 0;

  bufferStream
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          if (!row.name || !row.price || !row.category) {
            failCount++;
            continue;
          }

          // If ID exists, UPDATE it
          if (row._id && row._id.length === 24) {
            const product = await Product.findById(row._id);
            if (product) {
              product.name = row.name;
              product.price = Number(row.price);
              product.category = row.category;
              product.description = row.description || product.description;
              product.stock = row.stock ? Number(row.stock) : product.stock;
              product.isAvailable = row.isAvailable === 'true' || row.isAvailable === '1';
              await product.save();
              successCount++;
              continue;
            }
          }

          // Otherwise, CREATE new
          await Product.create({
            name: row.name,
            description: row.description || 'No description provided.',
            price: Number(row.price),
            originalPrice: row.originalPrice ? Number(row.originalPrice) : null,
            category: row.category,
            stock: row.stock ? Number(row.stock) : 10,
            isAvailable: row.isAvailable === 'true' || row.isAvailable === '1',
            images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' }] // default placeholder
          });
          successCount++;
        }
        res.status(200).json({ message: 'CSV Import completed successfully', successCount, failCount });
      } catch (error) {
        res.status(500).json({ message: 'Error processing imported rows', error: error.message });
      }
    });
});
