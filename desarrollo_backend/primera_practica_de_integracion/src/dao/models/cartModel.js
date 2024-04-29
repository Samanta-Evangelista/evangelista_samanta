import mongoose from "mongoose";

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
