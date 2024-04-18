import express from 'express';
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/cart.routers.js';
import { viewsRouter } from "./routes/views.routers.js";
import { ProductManager } from './service/productManager.js';

const port = 8080;
const app = express();
const productManager = new ProductManager();

app.use(express.json())

app.use(express.static(`${__dirname}/../public`));

app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

app.use('/api/products', productsRouter) //http://localhost:8080/api/products
app.use('/api/carts', cartsRouter)       //http://localhost:8080/api/carts

const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado: ", socket.id);
    const productList = await productManager.getProducts();
    socket.emit("productList", productList);

    socket.on("deleteProduct", async (productId) => {
        console.log("Eliminando en index: " + productId);
        await productManager.deleteProduct(productId);
    });
});


