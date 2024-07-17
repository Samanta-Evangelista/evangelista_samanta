import mongoose from "mongoose";
import { createHash } from "../../utils/crypt.js";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    minLength: 3,
    require: true,
  },
  last_name: {
    type: String,
    minLength: 3,
    require: true,
  },
  email: {
    type: String,
    minLength: 5,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    min: 18,
    require: true,
  },
  password: {
    type: String,
    minLength: 5,
    hash: true,
    require: true,
  },
  cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        }
      }
    ],
    default: []
  },
  rol: {
    type: String,
    require: true,
    default: "user"
  },
});

userSchema.pre("create", function () {
  this.password = createHash(this.password);
})

const userModel = mongoose.model(usersCollection, usersSchema);

export default userModel;
