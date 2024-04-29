import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/cart.routers.js';
import { viewsRouter } from "./routes/views.routers.js";
import { productManagerFS } from './dao/productManagerFS.js';



const app = express();
const productManager = new productManagerFS();

//Middlewars
app.use(express.json())
app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Routers
app.use("/", viewsRouter);
app.use('/api/products', productsRouter) //http://localhost:8080/api/products
app.use('/api/carts', cartsRouter)       //http://localhost:8080/api/carts

//Servidor Local
const port = 8080;
const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

//Mongo Atlas
const conexion = async () =>{
    try{
        await mongoose.connect("mongodb+srv://coderSE:coderSE@cluster0.lzhohyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {dbName: "Productos"})
        console.log("conectado a la bbdd remota de mongoDB ATLAS")
    }catch(error){
    console.log("fallo conexion")
}
}

conexion()

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


