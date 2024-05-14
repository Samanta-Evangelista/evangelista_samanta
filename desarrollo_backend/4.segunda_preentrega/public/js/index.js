const irAlCarrito = (event) => {
  event.preventDefault(); // Evita que el enlace siga la URL especificada en el atributo href
  window.location.href = "/cart";
};

const irAProducts = (event) => {
  event.preventDefault(); // Evita que el enlace siga la URL especificada en el atributo href
  window.location.href = "/products";
};
