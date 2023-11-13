import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "./config/connect";
import routes from "./routes";

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = parseInt(process.env.PORT || "") || 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hola Mundo");
});

routes(app);

db.then(() => {
  app.listen(port, () => {
    console.log(`[server] App listening at http://localhost:${port}`);
  });
});