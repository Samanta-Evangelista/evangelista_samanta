import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productColecction = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    index: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  thumbnails: {
    type: Array,
    require: false,
    default: [],
  },
  code: {
    type: String,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  status: {
    type: Boolean,
    require: false,
    default: true,
  },
  category: {
    type: String,
    require: true,
  },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productColecction, productSchema);

export default productModel;
