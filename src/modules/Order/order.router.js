import express from "express";
const router = express.Router();
import { isAuth } from "../../middleware/isauthMiddleware.js";
import validate from "../../middleware/validationMiddleware.js";
import { orderValidationSchema } from "../../modules/Order/order.validation.js";

import {
  CkeckoutOrder,
  GetAllOrders,
} from "../../modules/Order/order-controller.js";

router.post(
  "/checkout",
  isAuth,
  validate(orderValidationSchema),
  CkeckoutOrder
);

router.get("/orders", isAuth, GetAllOrders);

export default router;
