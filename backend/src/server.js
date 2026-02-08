require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api', routes);

app.get('/health', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const dbOk = state === 1;
    res.status(dbOk ? 200 : 503).json({
      ok: dbOk,
      db: 'WBS-Sarang',
      mongodb: dbOk ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.status(503).json({ ok: false, db: 'WBS-Sarang', error: e.message });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`WBS-Sarang API running on port ${PORT}`));
