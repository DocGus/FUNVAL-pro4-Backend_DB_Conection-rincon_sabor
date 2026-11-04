import pool from "../config/db.js";

// Obtener todos los productos
export const getAllProducts = async () => {
    const result = await pool.query(
        "SELECT * FROM products ORDER BY id"
    );

    return result.rows;
};

// Obtener un producto por ID
export const getProductById = async (id: number) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    return result.rows[0] ?? null;
};

// Crear un producto
export const insertProduct = async (
    name: string,
    description: string | null,
    price: number
) => {
    const result = await pool.query(
        `INSERT INTO products (name, description, price)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, description, price]
    );

    return result.rows[0];
};

// Actualizar un producto
export const updateProduct = async (
    id: number,
    name: string,
    description: string | null,
    price: number
) => {
    const result = await pool.query(
        `UPDATE products
         SET name = $1, description = $2, price = $3
         WHERE id = $4
         RETURNING *`,
        [name, description, price, id]
    );

    return result.rows[0] ?? null;
};