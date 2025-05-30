import express from "express";
import { register, login } from "../Auth/auth.controller.js";
import validate from "../../middleware/validationMiddleware.js";
import {
  userValidationSchemaSignUp,
  userValidationSchemaSignIn,
} from "../Auth/auth.validation.js";

const router = express.Router();

router.post("/register", validate(userValidationSchemaSignUp), register);
router.post("/login", validate(userValidationSchemaSignIn), login);

export default router;
