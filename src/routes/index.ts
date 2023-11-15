import { Express } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";

const routes = (app: Express) => {
  app.post("/users", userController.create);
  app.get("/users/:id", userController.findById);
  app.put("/users/:id", userController.update);
  app.delete("/users/:id", userController.delete);

  app.post("/groups", groupController.create);
  app.get("/groups", groupController.findAll);
  app.put("/groups/:id", groupController.update);
  app.delete("/groups/:id", groupController.delete);

  app.patch("/users/associate-to-group",userController.associateToGroup)

//  app.post("/login", userController.login);
};

export default routes;