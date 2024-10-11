import { Router } from "express";

import * as transaction from "../controllers/transaction.controller";

import {
  createTransactionValidator,
  updateransactionValidator,
} from "../middlewares/validators/transaction";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/one", auth, transaction.getOne);
router.get("/get", auth, transaction.get);
router.post("/create", auth, createTransactionValidator, transaction.create);
router.patch("/update", auth, updateransactionValidator, transaction.update);
router.delete("/delete", auth, transaction.remove);

export default router;
