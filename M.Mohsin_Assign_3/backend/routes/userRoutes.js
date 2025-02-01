// import express from 'express';
// import userController from '../controllers/UserLogic.js';


// const router = express.Router();

// router.post("/",userController.createUser);

// router.post('/signin', userController.loginUser);

// router.post('/signout', userController.logoutUser);

// export default router;
// routes/userRoutes.js

import express from 'express';
import userController from '../controllers/UserLogic.js';

const router = express.Router();

router.post("/", userController.createUser); // Signup route
router.post('/signin', userController.loginUser); // Login route
router.post('/signout', userController.logoutUser); // Logout route

export default router;
