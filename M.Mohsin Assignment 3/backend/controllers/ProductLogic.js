import mongoose from 'mongoose';
import Product from '../Models/Product.model.js';



const getProduct = async (req, res) => {
  try {
      const itemsPerPage = parseInt(req.query.limit) || 15;
      
      const totalProducts = await Product.countDocuments();
      
      const products = await Product.find({})
          .limit(itemsPerPage)
          .select('-__v'); 
      
      res.status(200).json({
          products,
          totalProducts
      });
  } catch (error) {
      res.status(500).json({
          message: "Error fetching products",
          error: error.message
      });
  }
};

const createProduct = async(req, res) => {
  console.log("inside create product");
  try {
      const { name, price, description} = req.body;

      console.log("data", req.name, req.price, req.description);
      console.log(req.body);

      if (!name || !price || !description) {
          return res.status(400).json({ message: "All fields are required" });
        }

        console.log("inside create product 2");

        console.log("inside",{ name, price, description} );

      const product = await Product.create({
          name:req.body.name,
          price:req.body.price,
          description:req.body.description,
      });
      console.log("inside", product);
      if(!product) {
        return res.status(500).json({ message: "Error creating product"});
      }
      res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
}


const updateProduct = async (req, res) => {
    try {
      const id = req.params; 
      const { name, price, description} = req.body; 
  
      // Validate the input
      if (!id || !name || !price || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        id, 
        {
          name,
          price,
          description,
          },
        { new: true, runValidators: true } 
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


const deleteProduct = async(req, res) => {
    try {
      console.log("in delete");
      const id = req.params.id;
      console.log("in delete", id);

      await Product.findByIdAndDelete(id);

      res.status(200).json("Product deleted succesfully");   
    } catch (error) {
        res.status(500).json("Error , user not deleted");        
    }
}
 
export default {getProduct, createProduct, updateProduct, deleteProduct};