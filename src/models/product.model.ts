import pool from "../config/db.js";

// Obtener productos con filtro y paginación
export const getAllProducts = async (
    maxPrice?: number,
    page: number = 1,
    limit: number = 10
) => {
    const values: number[] = [];
    let query = "SELECT * FROM products";

    // Filtro opcional por precio máximo
    if (maxPrice !== undefined) {
        values.push(maxPrice);
        query += ` WHERE price <= $${values.length}`;
    }

    // Paginación
    const offset = (page - 1) * limit;

    values.push(limit);
    const limitPosition = values.length;

    values.push(offset);
    const offsetPosition = values.length;

    query += ` ORDER BY id LIMIT $${limitPosition} OFFSET $${offsetPosition}`;

    const result = await pool.query(query, values);

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
