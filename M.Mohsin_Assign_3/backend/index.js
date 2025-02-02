import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';

const __filename = fileURLToPath(import.meta.url); // corrected to __filename
const __dirname = dirname(__filename); // corrected to __dirname

dotenv.config({ path: path.join(__dirname, "../../config/.env") });

const PORT = process.env.PORT || 5000;
if (!PORT) {
  console.error('PORT is not defined. Check your .env file or dotenv configuration.');
  process.exit(1);
}

const URL = process.env.FRONTEND_URL;
if (!URL) {
    console.log("FRONTEND_URL is not defined in the environment file");
}

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

// Health check route
app.use('/', (req, res) => {
    res.send("connected");
});

// Catch-all route for incorrect paths
app.use('/*', (req, res) => {
    res.send("Please enter a correct path");
});

// MongoDB connection
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
