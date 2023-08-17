import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 70, // allow 70 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100
});
