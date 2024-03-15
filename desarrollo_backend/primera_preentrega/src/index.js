import express from 'express';
import { ProductManager } from './productManager.js';
import { productsRouter } from './routes/products.router.js';


const PORT = 8080;

const app = express();

export const productManager = new ProductManager;

app.use(express.json())
app.use('/api/products', productsRouter)

app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}
)

