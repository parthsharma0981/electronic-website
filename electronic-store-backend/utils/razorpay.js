import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

let _instance = null;

/**
 * Lazy-initialize Razorpay — returns null if keys are missing
 * instead of crashing the entire server on startup.
 */
export const getRazorpay = () => {
  if (_instance) return _instance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.warn('⚠️  Razorpay keys missing — payment features disabled');
    return null;
  }

  try {
    _instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    return _instance;
  } catch (err) {
    console.error('❌ Razorpay init failed:', err.message);
    return null;
  }
};

// Keep backward compat — but now it won't crash on import
export const razorpayInstance = null; // deprecated, use getRazorpay()