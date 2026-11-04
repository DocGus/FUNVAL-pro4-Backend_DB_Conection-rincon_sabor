import type { Request, Response } from "express";

import {
    getAllProducts,
    getProductById,
    insertProduct,
    updateProduct
} from "../models/product.model.js";

// GET /api/menu
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();

        res.status(200).json(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);

        res.status(500).json({
            message: "Error al obtener los productos"
        });
    }
};

// GET /api/menu/:id
export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "El ID debe ser un número entero positivo"
            });
            return;
        }

        const product = await getProductById(id);

        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado"
            });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);

        res.status(500).json({
            message: "Error al obtener el producto"
        });
    }
};

// POST /api/menu
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            (description !== undefined &&
                description !== null &&
                typeof description !== "string") ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            res.status(400).json({
                message: "Datos del producto inválidos"
            });
            return;
        }

        const product = await insertProduct(
            name.trim(),
            description ?? null,
            price
        );

        res.status(201).json(product);
    } catch (error) {
        console.error("Error al crear el producto:", error);

        res.status(500).json({
            message: "Error al crear el producto"
        });
    }
};

// PUT /api/menu/:id
export const editProduct = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "El ID debe ser un número entero positivo"
            });
            return;
        }

        const { name, description, price } = req.body;

        if (
            typeof name !== "string" ||
            name.trim() === "" ||
            (description !== undefined &&
                description !== null &&
                typeof description !== "string") ||
            typeof price !== "number" ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            res.status(400).json({
                message: "Datos del producto inválidos"
            });
            return;
        }

        const product = await updateProduct(
            id,
            name.trim(),
            description ?? null,
            price
        );

        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado"
            });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);

        res.status(500).json({
            message: "Error al actualizar el producto"
        });
    }
};