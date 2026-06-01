const rateLimit = require('express-rate-limit');

// ── Login: 5 attempts per 15 minutes ─────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.',
  },
  // Key by IP + email body to prevent distributed attacks
  keyGenerator: (req) => `${req.ip}-${req.body?.email || ''}`,
});

// ── Signup: 3 accounts per hour per IP ───────────────────
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many accounts created from this IP. Try again in an hour.',
  },
});

// ── OTP send: 3 OTPs per hour per IP ─────────────────────
// Prevents SMS/email bombing
const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many OTP requests. Please wait before requesting another.',
  },
});

// ── OTP verify: 5 attempts per 15 min ────────────────────
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many OTP attempts. Please request a new OTP.',
  },
});

// ── General API: 100 requests per minute ─────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

module.exports = {
  loginLimiter,
  signupLimiter,
  otpSendLimiter,
  otpVerifyLimiter,
  apiLimiter,
};
