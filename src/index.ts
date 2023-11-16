import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "./config/connect";
import routes from "./routes";

/**
 * This file setups and launches the api using Express JS retrieving the port from environment variable
 */

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = parseInt(process.env.PORT || "") || 3000;

routes(app);

db.then(() => {
  app.listen(port, () => {
    console.log(`[server] App listening at http://localhost:${port}`);
  });
});