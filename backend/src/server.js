require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => res.json({ ok: true, db: 'WBS-Sarang' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`WBS-Sarang API running on port ${PORT}`));
