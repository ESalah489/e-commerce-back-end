import express from "express";
import { getUserById } from "../profile/profile.controller.js";
const router = express.Router();

router.get("/user/:id", getUserById);

export default router;
