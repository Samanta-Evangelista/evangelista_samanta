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
  };

  //Obtener todos los productos
  getProducts = async (limit, page, query, sort) => {
    try {
      // const aggregateQuery = [];

      // aggregateQuery.push({ $match: query || {} });
      // aggregateQuery.push({ $sort: { price: sort || 1 } });

      // const products = await productModel.aggregate(aggregateQuery).toArray();

      // const options = {
      //   page: page ?? 1,
      //   limit: limit ?? 10,
      //   lean: true,
      // };
      // const paginatedProducts = await productModel.paginate(products, options);

      // return paginatedProducts;

      console.log(sort);

      // return await productModel.find().lean();
      return await productModel.paginate(query ?? {}, {
        page: page ?? 1,
        limit: limit ?? 100,
        sort,
        lean: true,
      });
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
