import { Router } from "express";
import userModel from "../dao/models/userModel.js";

const userRouter = Router();

// userRouter.post("/register", async (req, res) => {
//   try {
//     const user = req.body;
//     await userModel.create(user);

//     delete user.password;
//     req.session.user = user;
//   } catch (e) {
//     res.redirect("/register");
//   }
// });

userRouter.post("/register", async (req, res) => {
  try {
    req.session.failRegister = false;
    await userModel.create(req.body);
    res.redirect("/login");
  } catch (e) {
    req.session.failRegister = true;
    res.redirect("/register");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    req.session.failLogin = false;
    const result = await userModel.findOne({ email: req.body.email });
    if (!result) {
      req.session.failLogin = true;
      return res.redirect("/login");
    }

    if (req.body.password !== result.password) {
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
