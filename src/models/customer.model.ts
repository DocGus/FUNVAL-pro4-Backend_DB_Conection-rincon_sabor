import pool from "../config/db.js";

// Obtener todos los clientes
export const getAllCustomers = async () => {
    const result = await pool.query(
        "SELECT * FROM customers ORDER BY id"
    );

    return result.rows;
};

// Obtener un cliente por ID
export const getCustomerById = async (id: number) => {
    const result = await pool.query(
        "SELECT * FROM customers WHERE id = $1",
        [id]
    );

    return result.rows[0] ?? null;
};

// Crear un cliente
export const insertCustomer = async (
    name: string,
    email: string,
    phoneNumber: string
) => {
    const result = await pool.query(
        `INSERT INTO customers (name, email, phone_number)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, email, phoneNumber]
    );

    return result.rows[0];
};

// Actualizar un cliente
export const updateCustomer = async (
    id: number,
    name: string,
    email: string,
    phoneNumber: string
) => {
    const result = await pool.query(
        `UPDATE customers
         SET name = $1, email = $2, phone_number = $3
         WHERE id = $4
         RETURNING *`,
        [name, email, phoneNumber, id]
    );

    return result.rows[0] ?? null;
};