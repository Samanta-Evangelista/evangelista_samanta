import { Router, response } from "express";
// import { cartManagerFS } from "../dao/cartManagerFS.js";
import { cartManagerBD } from "../dao/cartManagerDB.js";

const cartsRouter = Router();
// const cartManager = new cartManagerFS();
const cartManager = new cartManagerBD();

//Crear nuevo carrito ------> http://localhost:8080/api/carts/

// ADD CART
cartsRouter.post("/", async (req, res) => {
  try {
    const response = await cartManager.newCart();
    res.json(response);
  } catch (error) {
    res.status(404).send("Error al crear carrito");
  }
});

// GET PRODUCTS CART BY ID
cartsRouter.get(`/:cid/Products`, async (req, res) => {
  const { cid } = req.params;
  try {
    const response = await cartManager.getCartProducts(cid);
    res.json(response);
  } catch (error) {
    res.status(404).send("Error al intentar enviar los productos del carrito");
  }
});

// ADD PRODUCT TO CART
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartManager.addProductToCart(cid, pid);
    res.send("Producto agregado exitosamente");
  } catch (error) {
    res.status(404).send("Error al intentar guardar producto en el carrito");
  }
});

export { cartsRouter };
