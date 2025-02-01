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


// app.use(cors({
//     origin: `${URL}`, 
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
// })); 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));


app.listen(PORT, () => {
    console.log(`application listening on port ${PORT}`);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

    
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

app.use('/', (req, res) => {
    res.send("connected");
})

app.use('/*', (req, res) => {
    res.send("please enter correct path");
})


const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("conntected to mogo database");
}).catch ((error) => {
    console.error("Error in connecting to mongo", error);
}); 

export default app;