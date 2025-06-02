import express from  'express';
import cartController from './cart.controller.js';
import {isAuth} from '../../middleware/isauthMiddleware.js';

const router = express.Router();

router.post ('/add',isAuth, cartController.addToCart)
router.get ('/', isAuth, cartController.getCart)
router.put ("/update" , isAuth, cartController.updateQuantity)
router.delete ('/remove', isAuth, cartController.removeFromCart)
router.delete ('/clear', isAuth, cartController.clearCart)

export default router