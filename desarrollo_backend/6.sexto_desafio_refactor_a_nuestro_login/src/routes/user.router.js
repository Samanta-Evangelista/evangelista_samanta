import { Router } from "express";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/crypt.js";
import passport from "passport";

const userRouter = Router();

userRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/session/failRegister",
  }),
  async (req, res) => {
    res.redirect("/login");
  }
);

userRouter.get("/failRegister", async (req, res) => {
  console.log("Fallo en la estrategia");
  // res.status(400).send({ status: "error", message: "Registro fallido" });
  res.redirect("/register");
});

userRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/api/session/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Credenciales inválidas" });
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      rol: req.user.rol,
    };

    res.redirect("/");
  }
);

userRouter.get("/failLogin", async (req, res) => {
  // res.status(400).send({ status: "error", message: "Loguin fallido" });
  res.redirect("/login");
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

userRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    console.log("Entra por acá");
  }
);

userRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

export { userRouter };
