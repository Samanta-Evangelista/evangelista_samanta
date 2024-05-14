import { Router } from "express";
// import { productManagerFS } from "../dao/productManagerFS.js";
import { productManagerDB } from "../dao/productManagerDB.js";

const productsRouter = Router();
// const productManager = new productManagerFS();
const productManager = new productManagerDB();

productsRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.json(limitedProducts);
    }
    return res.json(products);
  } catch (error) {
    console.log(error);
    res.status(404).send("ERROR AL RECIBIR LOS PRODUCTOS");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const { pid } = req.params;
    const products = await productManager.getProductsById(pid);

    if (!products) return res.status(404).send("Producto no encontrado");

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(404).send(`ERROR AL RECIBIR EL PRODUCTO CON ID ${pid}`);
  }
});

productsRouter.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnails = [],
      code,
      stock,
      status = true,
      category,
    } = req.body;
    const response = await productManager.addProducts({
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    });
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(404).send("ERROR AL INTENTAR AGREGAR PRODUCTO: " + error);
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;

  console.log(req.body);

  try {
    const response = await productManager.updateProduct(pid, req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .send(`ERROR AL INTENTAR EDITAR PRODUCTO CON ID ${pid}: ${error}`);
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    return res.send(await productManager.deleteProduct(pid));
  } catch (error) {
    console.log(error);
    res.status(404).send(`ERROR AL INTENTAR ELIMINAR PRODUCTO CON ID ${pid}`);
  }
});

export { productsRouter };
