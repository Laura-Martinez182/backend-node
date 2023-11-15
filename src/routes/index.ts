import { Express } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import auth from "../middleware/auth";

const routes = (app: Express) => {
  app.post("/users", auth, userController.create);
  app.get("/users/:id", auth, userController.findById);
  app.put("/users/:id", auth, userController.update);
  app.delete("/users/:id", auth, userController.delete);

  app.post("/groups", auth, groupController.create);
  app.get("/groups", auth, groupController.findAll);
  app.put("/groups/:id", auth, groupController.update);
  app.delete("/groups/:id", auth, groupController.delete);

  app.patch("/users/associate-to-group", auth, userController.associateToGroup)
  app.patch("/users/remove-from-group", auth, userController.removeFromGroup)

  app.get("/users/:id/groups", auth,userController.getUserGroups)

  app.post("/login", userController.login);
};

export default routes;