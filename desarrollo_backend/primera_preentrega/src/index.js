import express from 'express';
import { ProductManager } from './productManager.js';
import { productsRouter } from './routes/products.router.js';
import e from 'express';

const PORT = 8080;

const app = express();

export const productManager = new ProductManager;

app.use('/products', productsRouter)

app.listen(PORT, (req, res) => {
    console.log('Servidor escuchando en el puerto ${PORT}');
}
)

