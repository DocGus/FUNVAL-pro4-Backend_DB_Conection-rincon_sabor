import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// Esquema de validación para productos
const productSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    description: z.string().trim().min(1, "La descripción es obligatoria"),
    price: z.number().positive("El precio debe ser mayor a cero"),
});

// Middleware de validación
export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.issues,
        });
    }

    next();
};