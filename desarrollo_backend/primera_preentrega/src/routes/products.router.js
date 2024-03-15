import { Router } from "express";
import { productManager } from "../index.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
    console.log("Entro por acáaaaa");

    try {
        const { limit } = req.query;
        const products = await productManager.getProducts()

        if (limit) {
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)
        }
        return res.json(products)
    } catch (error) {
        console.log(error);
        res.send('ERROR AL RECIBIR LOS PRODUCTOS')
    }

})

productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const { pid } = req.params;
        const products = await productManager.getProductsById(pid)
        res.json(products)
    } catch (error) {
        console.log(error);
        res.send(`ERROR AL RECIBIR EL PRODUCTO CON ID ${pid}`)
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.addProducts({ title, description, price, thumbnail, code, stock, status, category });
        res.json(response)
    } catch (error) {
        console.log(error);
        res.send('ERROR AL INTENTAR AGREGAR PRODUCTO')
    }
})

productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.updateProduct({ title, description, price, thumbnail, code, stock, status, category })
        res.json(response)
    } catch (error) {
        console.log(error);
        res.send(`ERROR AL INTENTAR EDITAR PRODUCTO CON ID ${pid}`)
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(id)

    } catch (error) {
        console.log(error);
        res.send(`ERROR AL INTENTAR ELIMINAR PRODUCTO CON ID ${pid}`)

    }
})


export { productsRouter }