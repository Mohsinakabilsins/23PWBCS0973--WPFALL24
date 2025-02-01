import { Router } from "express";
import productController from "../controllers/ProductLogic.js";
 
const router = new Router();

router.post("/", productController.createProduct);

router.get("/getProducts", productController.getProduct);

router.put("/updateProduct", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;