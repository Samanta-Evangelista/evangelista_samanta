import cartModel from "./models/cartModel.js";

export class cartManagerBD {
  getCarts = async () => {
    try {
      return await cartModel.find(); //.lean()
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al buscar los carritos");
    }
  };

  getCartProducts = async (id) => {
    try {
      const cart = await cartModel.findOne({ _id: id }); //.lean()
      return cart.products;
    } catch (error) {
      console.error(error.message);
      throw new Error(`Error al buscar el carrito ${id}`);
    }
  };

  newCart = async () => {
    try {
      const result = await cartModel.create({ product: [] });
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al crear el producto");
    }
  };

  addProductToCart = async (cart_id, product_id) => {
    try {
      // Buscar el carrito por su ID
      const cart = await cartModel.findById(cart_id);

      // Si no se encuentra el carrito, lanzar un error
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === product_id
      );

      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cart.products[existingProductIndex].quantity += 1;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({ product: product_id, quantity: 1 });
      }

      // Guardar el carrito actualizado en la base de datos
      const result = await cart.save();
      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al actualizar el carrito");
    }
  };
}
