"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";

import userRoutes from "./routes/user.routes.js"; // Rutas de usuario, que incluye /garzones
import indexRoutes from "./routes/index.routes.js";
import ingredienteRoutes from "./routes/ingrediente.routes.js";
import pedidoRoutes from "./routes/pedido.routes.js";
import mesaRoutes from "./routes/mesa.routes.js";
import chefRoutes from "./routes/chef.routes.js";

import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createInitialData } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";


async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    // Middleware de configuración
    app.use(cors({
      credentials: true,
      origin: true,
    }));

    app.use(urlencoded({
      extended: true,
      limit: "1mb",
    }));

    app.use(json({
      limit: "1mb",
    }));

    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(session({
      secret: cookieKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      },
    }));

    // Inicialización de Passport para autenticación
    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    // Registro de rutas
    app.use("/api", indexRoutes);
    app.use("/api/users", userRoutes); // Rutas de usuarios, que incluye /api/users/garzones
    app.use("/api/ingredientes", ingredienteRoutes);
    app.use("/api/pedidos", pedidoRoutes);
    app.use("/api/mesas", mesaRoutes); // Rutas de mesas
    app.use("/api/chef", chefRoutes);

    // Inicio del servidor
    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.error("Error en index.js -> setupServer():", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    await createInitialData();
  } catch (error) {
    console.error("Error en index.js -> setupAPI():", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.error("Error al iniciar la API:", error));
