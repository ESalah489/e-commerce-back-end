import express from "express";
import {
  getUserById,
  EditUserDataById,
} from "../profile/profile.controller.js";
const router = express.Router();

router.get("/user/:id", getUserById);
router.put("/user/:id", EditUserDataById);

export default router;
