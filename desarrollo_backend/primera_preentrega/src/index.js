import express from 'express';
import { ProductManager } from './productManager.js';
import { CartManager } from './cartManager.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/cart.routers.js';


const PORT = 8080;

const app = express();

export const productManager = new ProductManager;
export const cartManager = new CartManager;

app.use(express.json())
app.use('/api/products', productsRouter) //http://localhost:8080/api/products
app.use('/api/carts', cartsRouter)       //http://localhost:8080/api/carts

app.listen(PORT, (req, res) => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}
)

