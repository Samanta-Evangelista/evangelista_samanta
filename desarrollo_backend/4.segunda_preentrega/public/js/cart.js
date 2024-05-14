const addToCart = async (productId) => {
  debugger;
  try {
    const response = await fetch("/api/carts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener el carrito.");
    }

    const carrito = await response.json();

    const response2 = await fetch(
      `/api/carts/${carrito._id}/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response2.ok) {
      throw new Error("Error al agregar el producto al carrito.");
    } else {
      Swal.fire({
        title: "Confirmación",
        text: "El producto se agregó al carrito",
        icon: "success", // Puedes utilizar 'success', 'warning', 'error', o 'info'
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

const deleteProductToCart = async (productId, cartId) => {
  debugger;
  try {
    const response = await fetch(`api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el producto del carrito.");
    } else {
      Swal.fire({
        title: "Confirmación",
        text: "El producto se eliminó del carrito",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};
