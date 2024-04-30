import { Router, response } from "express";
// import { cartManagerFS } from "../dao/cartManagerFS.js";
import { cartManagerBD } from "../dao/cartManagDB.js";

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

// DELETE PRODUCT FROM CART
cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const result = await cartManager.deleteProductFromCart(cartId, productId);

    if (!result) {
      return res.status(400).send({
        message:
          "Hubo un error al eliminar el producto del carrito. Asegurese de que exista un carrito y un producto con esos ID",
      });
    }

    return res.status(200).send({ message: result });
  } catch (error) {
    console.error(error.message);
  }
});

// UPDATE PRODUCTS BY CART
cartsRouter.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  const products = req.body;

  try {
    const result = await cartManager.updateCartProducts(cartId, products);

    if (!result) {
      return res.status(400).send({
        message: "Hubo un error al actualizar el carrito. Intentelo de nuevo",
      });
    }

    return res
      .status(200)
      .send({ message: "Carrito actualizado correctamente", result: result });
  } catch (error) {
    console.error(error.message);
  }
});

// UPDATE QUANTITY PRODUCT BY CART
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const { quantity } = req.body;

  try {
    const result = await cartManager.updateProductQuantity(
      cartId,
      productId,
      quantity
    );

    if (!result) {
      return res.status(400).send({
        message:
          "Hubo un error al actualizar el producto. Asegurate de que los ID correspondan a un carrito y producto existentes",
      });
    }

    return res
      .status(200)
      .send({ message: "Se ha actualizado el carrito correctamente" });
  } catch (error) {
    console.error(error.message);
  }
});

// DELETE ALL PRODUCTS BY CART
cartsRouter.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const result = await cartManager.deleteAllProductsFromCart(cartId);

    if (!result) {
      return res.status(400).send({
        message:
          "Hubo un error al intentar eliminar todos los productos del carrito. Asegurese de que ese ID corresponda a un carrito",
      });
    }

    return res
      .status(200)
      .send({ message: "Todos los productos han sido eliminados del carrito" });
  } catch (error) {
    console.error(error.message);
  }
});

export { cartsRouter };
