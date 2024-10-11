import { Router } from "express";

import {
  me,
  register,
  login,
  refresh,
  logout,
} from "../controllers/user.controller";

import {
  registerValidator,
  loginValidator,
} from "../middlewares/validators/user";

import { auth } from "../middlewares/auth";

const router = Router();

router.get("/me", auth, me);
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
