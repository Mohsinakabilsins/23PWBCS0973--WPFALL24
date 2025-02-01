import mongoose from 'mongoose';
import Cart from "../Models/Cart.model.js";
import Product from "../Models/Product.model.js";
import getUserIdFromToken from './JWT_ID.js';

const calculateTotalPrice = (products) => {
    return products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

const formatCartProducts = (cartProducts) => {
    return cartProducts.map(item => ({
        productId: item.productId._id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));
};

const validateUserId = (userId, res) => {
    if (!userId) {
        throw {
            status: 401,
            message: "Invalid token"
        };
    }
};

const cartInfo = async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req);
        validateUserId(userId, res);

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const products = formatCartProducts(cart.products);
        const totalPrice = calculateTotalPrice(products);

        return res.status(200).json({ products, totalPrice });
    } catch (error) {
        const statusCode = error.status || 500;
        const message = error.status ? error.message : "Server error";
        return res.status(statusCode).json({ 
            message, 
            error: error.message 
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req);
        validateUserId(userId, res);

        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId }) || 
                  await Cart.create({ userId, products: [] });

        const productIndex = cart.products.findIndex(
            item => item.productId.toString() === productId
        );

        const updatedProduct = {
            productId: product._id,
            quantity,
            name: product.name,
            price: product.price
        };

        if (productIndex === -1) {
            cart.products.push(updatedProduct);
        } else {
            cart.products[productIndex] = updatedProduct;
        }

        await cart.save();
        
        const products = formatCartProducts(cart.products);
        const totalPrice = calculateTotalPrice(products);

        return res.status(200).json({ products, totalPrice });
    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const userId = await getUserIdFromToken(req);
        validateUserId(userId, res);

        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        const products = formatCartProducts(cart.products);
        const totalPrice = calculateToltalPrice(products);

        return res.status(200).json({ products, totalPrice });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error deleting item from cart", 
            error: error.message 
        });
    }
};

export default { updateCart, deleteCartItem, cartInfo };