import express    from 'express';

import dotenv     from 'dotenv';

import cors       from 'cors';

import helmet     from 'helmet';

import rateLimit  from 'express-rate-limit';

import path       from 'path';

import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import connectDB  from './config/db.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';



import authRoutes     from './routes/authRoutes.js';

import productRoutes  from './routes/productRoutes.js';

import orderRoutes    from './routes/orderRoutes.js';

import feedbackRoutes from './routes/feedbackRoutes.js';

import reviewRoutes   from './routes/reviewRoutes.js';

import categoryRoutes from './routes/categoryRoutes.js';

import couponRoutes   from './routes/couponRoutes.js';

import analyticsRoutes from './routes/analyticsRoutes.js';
import csvRoutes      from './routes/csvRoutes.js';
import chatRoutes     from './routes/chatRoutes.js';

dotenv.config();



// Warn about missing vars — only crash in production

const REQUIRED_ENV = [

  'MONGO_URI', 'JWT_SECRET',

  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',

  'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL',

  'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET',

];

const missing = REQUIRED_ENV.filter(k => !process.env[k]);

if (missing.length) {

  console.warn('⚠️  Missing env variables:', missing.join(', '));

}



connectDB();



const app     = express();

const isProd  = process.env.NODE_ENV === 'production';

const __dirname = path.dirname(fileURLToPath(import.meta.url));



app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));



// ── CORS — support multiple frontend origins ──

const getAllowedOrigins = () => {

  // Always allow production domains

  const origins = [
  ];



  // Primary frontend URL from env

  if (process.env.FRONTEND_URL) origins.push(process.env.FRONTEND_URL);



  // Extra origins (comma separated)

  if (process.env.EXTRA_ORIGINS) {

    process.env.EXTRA_ORIGINS.split(',').forEach(o => origins.push(o.trim()));

  }



  return [...new Set(origins.filter(Boolean))];

};



const corsOptions = {

  origin: (origin, cb) => {

    // Allow requests with no origin (mobile, Postman, server-to-server)

    if (!origin) return cb(null, true);



    const allowed = getAllowedOrigins();



    // In development allow all

    if (!isProd) return cb(null, true);



    if (allowed.includes(origin)) return cb(null, true);



    console.warn(`CORS blocked: ${origin} | Allowed: ${allowed.join(', ')}`);

    cb(new Error(`CORS blocked: ${origin}`));

  },

  credentials: true,

  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],

  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],

};



app.use(cors(corsOptions));



// Handle preflight — use same options so origin check is consistent

app.options('*', cors(corsOptions));



app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});



// Rate limiting

app.use('/api/', rateLimit({ windowMs:15*60*1000, max:300, standardHeaders:true, legacyHeaders:false }));

app.use('/api/auth/login',           rateLimit({ windowMs:15*60*1000, max:20 }));

app.use('/api/auth/forgot-password', rateLimit({ windowMs:15*60*1000, max:10 }));



// Health check

app.get('/api/health', (req, res) => {

  res.json({

    status:   'ok',

    time:     new Date().toISOString(),

    env:      isProd ? 'production' : 'development',

    origins:  getAllowedOrigins(),

  });

});



// API Routes

app.use('/api/auth',     authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/orders',   orderRoutes);

app.use('/api/feedback', feedbackRoutes);

app.use('/api/reviews',  reviewRoutes);

app.use('/api/coupons', couponRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/csv', csvRoutes);
app.use('/api/chat',     chatRoutes);



if (isProd) {

  const clientBuild = path.join(__dirname, '../frontend/dist');

  app.use(express.static(clientBuild));

  app.get('*', (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));

} else {

  app.get('/', (req, res) => res.json({ message: 'Electronic Store API ✨' }));

}



app.use(notFound);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

// Robust server start — auto-recovers from EADDRINUSE on Windows

function startServer(retries = 3) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} [${isProd ? 'PRODUCTION' : 'development'}]`);
    console.log(`📡 Allowed origins: ${getAllowedOrigins().join(', ') || 'ALL (dev mode)'}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please close the other server or change PORT.`);
      if (isProd) process.exit(1);
      // In dev, try to start on a fallback port or just exit cleanly
      console.error('Shutting down dev server due to port conflict. Please kill the port manually.');
      process.exit(1);
    } else {
      console.error('❌ Server failed to start:', err.message);
      if (isProd) process.exit(1);
    }
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 3000);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

startServer();

process.on('unhandledRejection', (err) => {
  console.error('⚠️  Unhandled Rejection:', err?.message || err);
  if (err?.stack) console.error(err.stack);
  // Don't crash in dev — let the server keep running
  if (isProd) {
    console.error('Shutting down due to unhandled rejection in production...');
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err?.message || err);
  if (err?.stack) console.error(err.stack);
  if (isProd) {
    console.error('Shutting down due to uncaught exception in production...');
    process.exit(1);
  }
});

