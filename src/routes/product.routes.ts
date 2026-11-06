import { Router, type IRouter } from "express";

import {
    getProducts,
    getProduct,
    createProduct,
    editProduct
} from "../controllers/product.controller.js";

import { validateProduct } from "../middlewares/validate-product.js";

const router: IRouter = Router();

// GET: Obtener todos los productos
/* #swagger.tags = ['Menu'] */
/* #swagger.summary = 'Obtener todos los productos' */
router.get("/menu", getProducts);

// GET: Obtener producto por ID
/* #swagger.tags = ['Menu'] */
/* #swagger.summary = 'Obtener un producto por ID' */
router.get("/menu/:id", getProduct);

// POST: Crear producto
/* #swagger.tags = ['Menu'] */
/* #swagger.summary = 'Crear un producto' */
router.post("/menu", validateProduct, createProduct);

// PUT: Actualizar producto
/* #swagger.tags = ['Menu'] */
/* #swagger.summary = 'Actualizar un producto' */
router.put("/menu/:id", editProduct);

export default router;