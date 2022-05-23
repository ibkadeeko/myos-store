import { Router } from 'express';

import userRouter from './user.routes';
import productRouter from './product.routes';
import cartRouter from './cart.routes';

const router = Router();

router.use(userRouter);
router.use('/products', productRouter);
router.use('/carts', cartRouter);

export default router;
