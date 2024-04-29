import productModel from "./models/productModel.js";

export class productManagerDB {
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

    try {
      const result = await productModel.create({
        title,
        description,
        price,
        thumbnails: thumbnails ?? [],
        code,
        stock,
        status,
        category,
      });

      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al crear el producto");
    }

    await fs.writeFile(this.path, JSON.stringify(this.products));

    return newProduct;
  };

  //Obtener todos los productos
  getProducts = async () => {
    try {
      return await productModel.find();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al buscar los productos");
    }
  };

  //Obtener un producto especifico.
  getProductsById = async (id) => {
    const product = await productModel.findOne({ _id: id });

    if (!product) throw new Error(`El producto ${id} no existe.`);

    return product;
  };

  //actualizar un producto especifico
  updateProduct = async (pid, { ...data }) => {
    try {
      const result = await productModel.updateOne({ _id: pid }, { ...data });
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al actualizar el producto");
    }
  };

  //eliminar producto especifico.
  deleteProduct = async (pid) => {
    try {
      const result = await productModel.deleteOne({ _id: pid });

      if (result.deletedCount === 0)
        throw new Error(`El producto ${pid} no existe.`);

      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al eliminar el producto");
    }
  };
}
