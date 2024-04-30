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

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const validateProduct = await cartModel.findOne({
        _id: cartId,
        "products.product": productId,
      });

      console.log(validateProduct);

      if (!validateProduct) {
        return;
      }

      const result = await cartModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $pull: { products: { product: productId } } }
      );

      if (!result) {
        return;
      }

      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  updateCartProducts = async (cartId, products) => {
    try {
      const validateCart = await cartModel.findOne({ _id: cartId });

      if (!validateCart) {
        return;
      }

      const result = cartModel.updateOne(
        { _id: cartId },
        { products: products }
      );

      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const validateCart = await cartModel.findOne({ _id: cartId });

      if (!validateCart) {
        console.log("carrito inexistente");
        return;
      }

      const productInCart = validateCart.products.find(
        (prod) => prod.product == productId
      );

      if (!productInCart) {
        return;
      }

      const result = await cartModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } }
      );

      if (!result) {
        return;
      }

      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  deleteAllProductsFromCart = async (cartId) => {
    try {
      const validateCart = await cartModel.findOne({ _id: cartId });

      if (!validateCart) {
        return;
      }

      const result = await cartModel.updateOne(
        { _id: cartId },
        { products: [] }
      );

      return result;
    } catch (error) {
      console.error(error.message);
    }
  };
}
