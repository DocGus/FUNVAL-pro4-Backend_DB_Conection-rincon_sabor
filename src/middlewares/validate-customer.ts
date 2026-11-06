import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const customerSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre no puede superar 100 caracteres"),

    email: z.string()
        .trim()
        .email("El correo electrónico no es válido")
        .max(150, "El correo no puede superar 150 caracteres"),

    phone_number: z.string()
        .trim()
        .max(20, "El teléfono no puede superar 20 caracteres")
        .nullable()
        .optional(),
});

export const validateCustomer = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = customerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.issues,
        });
    }

    req.body = result.data;
    next();
};
