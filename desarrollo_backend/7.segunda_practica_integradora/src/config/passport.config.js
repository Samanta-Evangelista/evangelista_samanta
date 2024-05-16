import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/models/userModel.js";
import { createHash, isValidPassword } from "../utils/crypt.js";

const LocalStrategy = local.Strategy;
const initializatePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userModel.findOne({ email: username });

          if (user) {
            console.log("El usuario ya existe.");
            return done(null, false);
          }

          let rolUsuario = "usuario";
          if (email === "adminCoder@coder.com") {
            rolUsuario = "admin";
          }

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol: rolUsuario,
          };

          let result = await userModel.create(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error al obtener el usuario:" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            const errorMessage = "El usuario no existe";
            console.log(errorMessage);
            return done(errorMessage);
          }

          if (!isValidPassword(user, password)) {
            return done(null, false);
            // return done("Usuario o password incorrecto");
          }

          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23liIW33BOcVNRnzIA",
        clientSecret: "6bfc2d98365f7ec3c290d604310c788c3d405c49",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          console.log(profile._json.email);

          const user = await userModel.findOne({ email: profile._json.email });

          let rolUsuario = "usuario";
          if (profile._json.email === "adminCoder@coder.com") {
            rolUsuario = "admin";
          }

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              age: 34,
              rol: rolUsuario,
              password: "",
            };

            let result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done("Error al obtener el usuario:" + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializatePassport;
