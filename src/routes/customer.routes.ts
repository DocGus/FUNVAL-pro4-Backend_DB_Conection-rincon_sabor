
import { Router, type IRouter } from "express";

import {
    getCustomers,
    getCustomer,
    createCustomer,
    editCustomer
} from "../controllers/customer.controller.js";

import { validateCustomer } from "../middlewares/validate-customer.js";

const router: IRouter = Router();

// GET /api/customers
router.get("/customers", getCustomers);

// GET /api/customers/:id
router.get("/customers/:id", getCustomer);

// POST /api/customers
router.post("/customers", validateCustomer, createCustomer);

// PUT /api/customers/:id
router.put("/customers/:id", validateCustomer, editCustomer);

export default router;
