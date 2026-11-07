import pool from "../config/db.js";

// Obtener todas las ventas con nombre del cliente
export const getAllSales = async () => {
    const result = await pool.query(`
        SELECT
            s.id,
            s.customer_id,
            c.name AS customer_name,
            COALESCE(SUM(sd.quantity * sd.unit_price), 0) AS total
        FROM sales s
        INNER JOIN customers c ON s.customer_id = c.id
        LEFT JOIN sale_details sd ON s.id = sd.sale_id
        GROUP BY s.id, s.customer_id, c.name
        ORDER BY s.id
    `);

    return result.rows;
};

// Obtener una venta por ID
export const getSaleById = async (id: number) => {
    const result = await pool.query(`
        SELECT
            s.id,
            s.customer_id,
            c.name AS customer_name,
            COALESCE(SUM(sd.quantity * sd.unit_price), 0) AS total
        FROM sales s
        INNER JOIN customers c ON s.customer_id = c.id
        LEFT JOIN sale_details sd ON s.id = sd.sale_id
        WHERE s.id = $1
        GROUP BY s.id, s.customer_id, c.name
    `, [id]);

    return result.rows[0] ?? null;
};

// Crear una venta
export const insertSale = async (customerId: number) => {
    const result = await pool.query(
        `INSERT INTO sales (customer_id)
         VALUES ($1)
         RETURNING *`,
        [customerId]
    );

    return result.rows[0];
};

// Crear venta y detalles dentro de una transacción
export const insertSaleWithDetails = async (
    customerId: number,
    items: {
        product_id: number;
        quantity: number;
        unit_price: number;
    }[]
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const saleResult = await client.query(
            `INSERT INTO sales (customer_id)
             VALUES ($1)
             RETURNING *`,
            [customerId]
        );

        const sale = saleResult.rows[0];

        for (const item of items) {
            await client.query(
                `INSERT INTO sale_details
                 (sale_id, product_id, quantity, unit_price)
                 VALUES ($1, $2, $3, $4)`,
                [sale.id, item.product_id, item.quantity, item.unit_price]
            );
        }

        await client.query("COMMIT");

        return { ...sale, items };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};
