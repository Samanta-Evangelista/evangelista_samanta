import { AsyncLocalStorage } from 'async_hooks';
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class ProductManager {

    constructor() {
        this.path = 'products.json';
        this.products = []

        // parametros del producto
        addProducts = async ({ title, description, price, thumbnail, code, stock, status, category }) => {

            //se genera un id unico y aleatorio
            const id = uuidv4()

            //le agregamos el id al producto
            let newProduct = {
                id, title, description, price, thumbnail, code, stock, status, category
            }

            this.products=await this.getProducts();
            this.products.push(newProduct);

            //guardamos en el archivo JSON todo el array, que estaba vacio, con el nuevo producto.
            await fs.writeFile(this.path, JSON.stringify(this.products));

            return newProduct;
        }
        getProducts = async () => {
            const response = await fs.readFile(this.path, 'utf-8');
            const responseJSON=JSON.parse(response)

            return responseJSON;

        }

        getProductsById= async (id) => {
const response=this.getProducts();

const product= response.find(product=> product.id === id)

if(product){
    return product
} else {
    console.log('Producto no encontrado');
}
        }

        
    }


}