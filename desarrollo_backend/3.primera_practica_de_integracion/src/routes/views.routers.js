import { Router } from "express";
import { productManagerFS } from "../dao/productManagerFS.js";

const viewsRouter = Router();
const productManager = new productManagerFS();

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
            script: "realtimeproducts.js",
            productList
        }
        );
    } catch (error) {
        res.status(500).send(error.message);
    }    
});


export {viewsRouter}