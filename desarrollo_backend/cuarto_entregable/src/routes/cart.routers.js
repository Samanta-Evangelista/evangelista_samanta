import { Router, response } from "express";
import { CartManager } from "../service/cartManager.js";

const cartsRouter = Router();
const cartManager = new CartManager();

//Crear nuevo carrito ------> http://localhost:8080/api/carts/

cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart()
        res.json(response)
    } catch (error) {
        res.status(404).send('Error al crear carrito')
    }
})

cartsRouter.get(`/:cid/Products`, async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await cartManager.getCartProducts(cid)
        res.json(response)
    } catch (error) {
        res.status(404).send('Error al intentar enviar los productos del carrito')
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid)
        res.send('Producto agregado exitosamente')
    } catch (error) {
        res.status(404).send('Error al intentar guardar producto en el carrito')
    }
})

export {cartsRouter}