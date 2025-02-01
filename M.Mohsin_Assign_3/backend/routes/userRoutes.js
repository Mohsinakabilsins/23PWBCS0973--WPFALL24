import express from 'express';
import userController from '../controllers/UserLogic.js';


const router = express.Router();

router.post("/",userController.createUser);

router.post('/signin', userController.loginUser);

router.post('/signout', userController.logoutUser);

export default router;
