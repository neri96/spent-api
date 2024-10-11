import { Router } from "express";

import * as analytics from "../controllers/analytics.controller";

import { auth } from "../middlewares/auth";

const router = Router();

router.get("/get", auth, analytics.get);

export default router;
