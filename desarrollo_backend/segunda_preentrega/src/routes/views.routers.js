import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";

const viewsRouter = Router();
const productManager = new productManagerDB();

viewsRouter.get("/", async (req, res) => {
  try {
    let { limit = 3, page = 1 } = req.query;

    const productList = await productManager.getProducts(limit, page);
    // console.log(productList.nextPage);

    res.render("home", {
      title: "Home",
      style: "home.css",
      productList,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

viewsRouter.get("/products", async (req, res) => {
  try {
    let { limit = 3, page = 1 } = req.query;

    const productList = await productManager.getProducts(limit, page);
    // console.log(productList.nextPage);

    res.render("products", {
      title: "products",
      style: "home.css",
      productList,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const productList = await productManager.getProducts();
    res.render("realtimeproducts", {
      title: "Real Time Products",
      style: "realtimeproducts.css",
      script: "realtimeproducts.js",
      productList,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export { viewsRouter };
