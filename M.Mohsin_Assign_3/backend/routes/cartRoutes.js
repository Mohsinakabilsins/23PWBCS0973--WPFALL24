import { Router } from "express";
import cartController from "../controllers/CartLogic.js";
 
const router = new Router();

router.get("/getCart", cartController.cartInfo);

router.put("/updateCart", cartController.updateCart);

router.put("/deleteItem", cartController.deleteCartItem);

export default router;