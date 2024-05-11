import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils/constants.js";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/cart.routers.js";
import { userRouter } from "./routes/user.router.js";
import { viewsRouter } from "./routes/views.routers.js";
import { productManagerDB } from "./dao/productManagerDB.js";
import mongoStore from "connect-mongo";
import session from "express-session";

const app = express();
const productManager = new productManagerDB();

const uri =
  "mongodb+srv://coderSE:coderSE@cluster0.lzhohyn.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

//Mongo Atlas
const conexion = async () => {
  try {
    await mongoose.connect(uri);
    console.log("conectado a la bbdd remota de mongoDB ATLAS");
  } catch (error) {
    console.log("fallo conexión");
  }
};

conexion();

//Middlewars
app.use(express.json());
app.use(express.static(`${__dirname}/../../public`));
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");

//Session
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: uri,
      ttl: 20,
    }),
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: true,
  })
);

//Routers
app.use("/", viewsRouter);
app.use("/api/session", userRouter); //http://localhost:8080/api/sessions
app.use("/api/products", productsRouter); //http://localhost:8080/api/products
app.use("/api/carts", cartsRouter); //http://localhost:8080/api/carts

//Servidor Local
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

//WebSocket
const socketServer = new Server(httpServer);

//para escuchar la conexion de un nuevo socket
socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado: ", socket.id);
  const productList = await productManager.getProducts();
  socket.emit("productList", productList);

  socket.on("deleteProduct", async (productId) => {
    console.log("Eliminando en index: " + productId);
    await productManager.deleteProduct(productId);
  });
});
