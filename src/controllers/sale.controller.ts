import type { Request, Response } from "express";
import {
    getAllSales,
    getSaleById,
    insertSaleWithDetails
} from "../models/sale.model.js";

// GET /api/sales
export const getSales = async (_req: Request, res: Response) => {
    try {
        const sales = await getAllSales();
        res.status(200).json(sales);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ message: "Error al obtener ventas" });
    }
};

// GET /api/sales/:id
export const getSale = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        const sale = await getSaleById(id);

        if (!sale) {
            res.status(404).json({ message: "Venta no encontrada" });
            return;
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error("Error al obtener venta:", error);
        res.status(500).json({ message: "Error al obtener venta" });
    }
};

// POST /api/sales
export const createSale = async (req: Request, res: Response) => {
    try {
        const { customer_id, items } = req.body;

        if (
            !Number.isInteger(customer_id) ||
            customer_id <= 0 ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !items.every((item) =>
                Number.isInteger(item.product_id) && item.product_id > 0 &&
                Number.isInteger(item.quantity) && item.quantity > 0 &&
                typeof item.unit_price === "number" &&
                Number.isFinite(item.unit_price) && item.unit_price >= 0
            )
        ) {
            res.status(400).json({
                message: "Datos de venta inválidos"
            });
            return;
        }

        const sale = await insertSaleWithDetails(customer_id, items);

        res.status(201).json(sale);
    } catch (error) {
        console.error("Error al crear venta:", error);
        res.status(500).json({
            message: "Error al crear la venta. La transacción fue revertida si ocurrió un error."
        });
    }
};
