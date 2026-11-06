
import type { Request, Response } from "express";

import {
    getAllCustomers,
    getCustomerById,
    insertCustomer,
    updateCustomer
} from "../models/customer.model.js";

// GET /api/customers
export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await getAllCustomers();

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);

        res.status(500).json({
            message: "Error al obtener los clientes"
        });
    }
};

// GET /api/customers/:id
export const getCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "El ID debe ser un número entero positivo"
            });
            return;
        }

        const customer = await getCustomerById(id);

        if (!customer) {
            res.status(404).json({
                message: "Cliente no encontrado"
            });
            return;
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error al obtener el cliente:", error);

        res.status(500).json({
            message: "Error al obtener el cliente"
        });
    }
};

// POST /api/customers
export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, email, phone_number } = req.body;

        const customer = await insertCustomer(
            name,
            email,
            phone_number ?? null
        );

        res.status(201).json(customer);
    } catch (error) {
        console.error("Error al crear el cliente:", error);

        res.status(500).json({
            message: "Error al crear el cliente"
        });
    }
};

// PUT /api/customers/:id
export const editCustomer = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "El ID debe ser un número entero positivo"
            });
            return;
        }

        const { name, email, phone_number } = req.body;

        const customer = await updateCustomer(
            id,
            name,
            email,
            phone_number ?? null
        );

        if (!customer) {
            res.status(404).json({
                message: "Cliente no encontrado"
            });
            return;
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);

        res.status(500).json({
            message: "Error al actualizar el cliente"
        });
    }
};
