import userModel from "./models/userModel.js";
import { isValidPassword } from "../utils/crypt.js";

export class userManagerBD {

  getAllUsers = async () => {
    try {
      return await userModel.find().lean();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al consultar los usuarios");
    }
  };

  getUser = async (uid) => {
    try {
      return await userModel.findOne({_id: uid}).lean();
    } catch (error) {
      console.error(error.message);
      throw new Error("Usuario no registrado");
    }
  };

  register = async (user) => {
    const { first_name, last_name, email, age, password} = user;

    if (!first_name || !last_name || !email || !age || !password) {
      throw new Error("Error al registrar los usuarios");
    }

    try {
      await userModel.create({first_name, last_name, email, age, password});
      return "Usuario registrado correctamente";
    } catch (error) {
      console.error (error.message);
      throw error;
    } 
  }


login = async (email, password) => {
  const errorMessage = "Credenciales inválidas";

  if ( !email || !password) {
    throw new Error("errorMessage");
  }

  try {
    const user = await userModel.findOne({ email });

    if ( !user ) throw new Error("errorMessage");

    if (isValidPassword(user, password)) {
      return user;
    }

    throw new Error("errorMessage");

  } catch (error) {
    console.error (error.message);
    throw error;
  } 
}
}


export { userManagerBD };