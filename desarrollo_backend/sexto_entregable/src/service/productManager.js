import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

export class ProductManager {
  constructor() {
    this.path = "./src/data/products.json";
    this.products = [];
  }

  addProducts = async ({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    status,
    category,
  }) => {
    if (!title || !description || !price || !code || !stock || !category) {
      throw new Error("Todos los campos son obligatorios");
    }

    const id = uuidv4();

    let newProduct = {
      id,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    };

    this.products = await this.getProducts();

    if(this.products.find((product) => product.code == code)){
      throw new Error("El campo 'codigo' ya existe. Por favor, ingrese otro código.");
    }

    this.products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(this.products));

    return newProduct;
  };

  //Obtener todos los productos
  getProducts = async () => {
    const response = await fs.readFile(this.path, "utf-8");
    const responseJSON = JSON.parse(response);
    return responseJSON;
  };

  //Obtener un producto especifico.
  getProductsById = async (id) => {
    const products = await this.getProducts();

    const product = products.find((product) => product.id === id);

    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  };

  //actualizar un producto especifico
  updateProduct = async (pid, { ...data }) => {
    const response = await this.getProducts();

console.log(data)

    if(response.find((product) => product.code == data.code)){
      throw new Error("El campo 'codigo' ya existe. Por favor, ingrese otro código.");
    }

    const index = response.findIndex((product) => product.id == pid);

    if (index != -1) {
      
      const updatedProduct = { ...response[index], ...data };
      response[index] = updatedProduct;
      await fs.writeFile(this.path, JSON.stringify(response));
      return response[index];
    } else {
      console.log("Producto no encontrado");
    }
  };

  //eliminar producto especifico.
  deleteProduct = async (pid) => {
    const products = await this.getProducts();
    const index = products.findIndex((product) => product.id == pid);

    if (index !== -1) {
      products.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(products));
      console.log("Producto eliminado");
      return "Producto Eliminado"
    } else {
      console.log("Producto no encotrado: " + pid);
      return "Producto no encotrado"
    }
  };
}
