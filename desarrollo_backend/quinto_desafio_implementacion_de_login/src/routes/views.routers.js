import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import { cartManagerBD } from "../dao/cartManagerDB.js";
import { auth } from "../middlewares/auth.js";

const viewsRouter = Router();
const productManager = new productManagerDB();
const cartManager = new cartManagerBD();

viewsRouter.get("/", auth, async (req, res) => {
  res.redirect("/products");
});

viewsRouter.get("/products", auth, async (req, res) => {
  try {
    let { limit = 3, page = 1 } = req.query;

    const productList = await productManager.getProducts(limit, page);
    // console.log(productList.nextPage);

    res.render("products", {
      title: "products",
      style: "home.css",
      productList,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

viewsRouter.get("/cart", auth, async (req, res) => {
  try {
    const cart = await cartManager.getCart();

    res.render("cart", {
      title: "cart",
      style: "home.css",
      products: cart.products,
      cartId: cart._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

viewsRouter.get("/login", async (req, res) => {
  try {
    res.render("login", {
      title: "login",
      style: "home.css",
      failLogin: req.session.failLogin ?? false,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

viewsRouter.get("/register", async (req, res) => {
  try {
    res.render("register", {
      title: "register",
      style: "home.css",
      failLogin: req.session.failRegister ?? false,
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
