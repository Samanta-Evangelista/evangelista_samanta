import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/crypt.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    req.session.failRegister = false;

    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      res.status(500).send("CAMPOS INCOMPLETOS");
    }

    let rolUsuario = "usuario";
    if (email === "adminCoder@coder.com") {
      if (password === "adminCod3r123") {
        rolUsuario = "admin";
      } else {
        console.log(
          "El usuario es reservado. Proporcione la contraseña correcta."
        );
        return;
      }
    }

    await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      rol: rolUsuario,
    });

    res.redirect("/login");
  } catch (e) {
    req.session.failRegister = true;

    res.redirect("/register");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    req.session.failLogin = false;
    const result = await userModel.findOne({ email: req.body.email }).lean();
    if (!result) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }

    if (!isValidPassword(result, req.body.password)) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }

    delete result.password;
    req.session.user = result;
    return res.redirect("/");
  } catch (e) {
    return res.redirect("/login");
  }
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/login");
  });
});

userRouter.get("/", async (req, res) => {
  console.log(req.session);
  if (req.session.counter) {
    req.session.counter++;
    res.send(`Veces ingresado ${req.session.counter}`);
  } else {
    req.session.counter = 1;
    res.send("Bienvenido!");
  }
});

export { userRouter };
