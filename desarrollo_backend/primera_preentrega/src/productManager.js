import { AsyncLocalStorage } from 'async_hooks';
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class ProductManager {

    constructor() {
        this.path = 'products.json';
        this.products = []
    }

    
    //agrgar producto
    addProducts = async ({ title, description, price, thumbnail, code, stock, status, category }) => {

        const id = uuidv4()

        let newProduct = {
            id, title, description, price, thumbnail, code, stock, status, category
        }

        this.products = await this.getProducts();
        this.products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(this.products));

        return newProduct;
    }

    //Obtener todos los productos
    getProducts = async () => {
        const response = await fs.readFile(this.path, 'utf-8');
        const responseJSON = JSON.parse(response)
        return responseJSON;

    }

    //Obtener un producto especifico.
    getProductsById = async (id) => {
        const products = await this.getProducts();

        const product = products.find(product => product.id === id)

        if (product) {
            return product
        } else {
            console.log('Producto no encontrado');
        }
    }

    //actualizar un producto especifico
    updateProduct = async (id, { ...data }) => {
        const response = await this.getProducts()
        const index = response.findIndex(product => product.id === id)

        if (index !== -1) {
            response[index] = { id, ...data }
            await fs.writeFile(this.path, JSON.stringify(response))
            return response[index]
        } else {
            console.log('Producto no encontrado');
        }
    }

    //eliminar producto especifico. 
    deleteProducts = async (id) => {
        const products = await this.getProducts()
        const index = products.findIndex(product => product.id === id)

        if (index !== -1) {
            products.splice(index, 1)
            await fs.writeFile(this.path, JSON.stringify(products))
        } else{
            console.log('Producto no encotrado');
        }

    }
}