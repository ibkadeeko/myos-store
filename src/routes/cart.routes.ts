import express from 'express';
import { cartController } from '../controllers';
import { verifyToken } from '../utils';

const router = express.Router();

router.post('(/:id)?/product', verifyToken, cartController.addToCart);
router.get('(/:id)?', verifyToken, cartController.getCart);
router.delete('/:id/item/:itemId', verifyToken, cartController.removeFromCart);
router.post('/:id/checkout', verifyToken, cartController.checkoutCart);

export default router;
