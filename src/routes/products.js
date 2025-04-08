const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true
});
const Product = mongoose.model('Product', productSchema);

// 1. Route POST /init-sample
router.post('/init-sample', async (req, res) => {
  try {
    const deleteResult = await Product.deleteMany({});
    console.log('Deleted existing products:', deleteResult);
    
    const sampleProducts = [
      {
        name: "MacBook Pro M2",
        price: 1999,
        description: "Latest Apple laptop with M2 chip"
      },
      {
        name: "iPhone 14 Pro",
        price: 999,
        description: "Premium smartphone with dynamic island"
      },
      {
        name: "Sony WH-1000XM4",
        price: 349,
        description: "High-end noise cancelling headphones"
      },
      {
        name: "Samsung Galaxy S23",
        price: 799,
        description: "Flagship Android smartphone"
      },
      {
        name: "iPad Air",
        price: 599,
        description: "Versatile tablet for work and entertainment"
      },
      {
        name: "Dell XPS 13",
        price: 1299,
        description: "Premium Windows ultrabook"
      },
      {
        name: "AirPods Pro",
        price: 249,
        description: "Wireless earbuds with active noise cancellation"
      },
      {
        name: "Nintendo Switch OLED",
        price: 349,
        description: "Portable gaming console with OLED screen"
      },
      {
        name: "Canon EOS R6",
        price: 2499,
        description: "Professional mirrorless camera"
      },
      {
        name: "Microsoft Surface Pro 8",
        price: 999,
        description: "2-in-1 laptop tablet hybrid"
      }
    ];
    
    const result = await Product.insertMany(sampleProducts);
    console.log('Sample products initialized:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error('Error initializing sample products:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Route GET /check-db
router.get('/check-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const count = await Product.countDocuments();
    
    res.json({
      collections: collections,
      productCount: count,
      schema: Object.keys(Product.schema.paths)
    });
  } catch (error) {
    console.error('Database check error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Route GET /search
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ name: new RegExp(name, 'i') });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Route GET / (all products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    console.log('Query result:', JSON.stringify(products, null, 2));
    
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error in GET /products:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Route GET /:id (PHẢI ĐẶT SAU CÙNG)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Route PUT /:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Route DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
