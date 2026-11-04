import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import productRouter from "./routes/product.routes.js";
import cors from "cors";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Documentación Swagger
app.use("/api/docs", swaggerRouter);

// Endpoint de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

// Rutas de productos
app.use("/api", productRouter);

app.listen(port, () => {
    console.log(`URL: http://localhost:${port}`);
});