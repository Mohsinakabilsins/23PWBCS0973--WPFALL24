import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../config/.env") });

const PORT = process.env.PORT || 5000;
if (!PORT) {
  console.error('PORT is not defined. Check your .env file or dotenv configuration.');
  process.exit(1);
}

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
    console.error("FRONTEND_URL is not defined in the environment file");
    process.exit(1);
}

const app = express();

// CORS configuration
app.use(cors({
    origin: FRONTEND_URL, 
    credentials: true
}));

// Body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

// Health check or sample route
app.get('/some-route', (req, res) => {
    res.json({ message: 'CORS is set up!' });
});

// Catch-all route for incorrect paths
app.use('/*', (req, res) => {
    res.send("Please enter a correct path");
});

// Database connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.error("Error in connecting to MongoDB:", error);
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
});

export default app;
