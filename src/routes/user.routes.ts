import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;
