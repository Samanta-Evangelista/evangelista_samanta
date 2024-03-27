import { Router } from "express";
import { ProductManager } from "../service/productManager.js";

const viewsRouter = Router();
const productManager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render(
            "home",
            {
                title: "Home",
                style: "home.css",
                productList
            });
    } catch (error) {
        res.status(500).send(error);
    }    
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const productList = await productManager.getProducts();
        res.render("realtimeproducts",
        {
            title: "Real Time Products",
            style: "realtimeproducts.css",
            productList
        }
        );
    } catch (error) {
        res.status(500).send(error.message);
    }    
});


export {viewsRouter}