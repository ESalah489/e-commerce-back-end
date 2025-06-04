import express from "express";
import { toggleWishlist, getWishlist } from "./wishlist.controller.js";
import { isAuth } from "../../middleware/isauthMiddleware.js";

const router = express.Router();

router.use(isAuth); // ✅ Authenticate all routes

// Toggle product in wishlist
router.post("/", toggleWishlist);

// Get user wishlist
router.get("/", getWishlist);

export default router;
