import { Express } from "express";
import userController from "../controllers/user.controller";
import groupController from "../controllers/group.controller";
import auth from "../middleware/auth";
import auth_superadmin from "../middleware/auth.superadmin";
import { schemaValidation } from "../middleware/schemasValidation";
import { userSchema } from "../schemas/user.schema";
import { groupSchema } from "../schemas/group.schema";

/**
 * Defines various routes for user and group operations, along with authentication and
 * schema validation middleware.
 * @param {Express} app - The parameter `app` is an instance of the Express application. It is used to
 * define the routes and handle the HTTP requests and responses.
 */
const routes = (app: Express) => {
  app.post("/users", auth_superadmin, schemaValidation(userSchema), userController.create);
  app.get("/users/:id", auth, userController.findById);
  app.put("/users/:id", auth, schemaValidation(userSchema), userController.update);
  app.delete("/users/:id", auth, userController.delete);

  app.post("/groups", auth, schemaValidation(groupSchema), groupController.create);
  app.get("/groups", auth, groupController.findAll);
  app.put("/groups/:id", auth, schemaValidation(groupSchema), groupController.update);
  app.delete("/groups/:id", auth, groupController.delete);

  app.patch("/users/associate-to-group", auth, userController.associateToGroup)
  app.patch("/users/remove-from-group", auth, userController.removeFromGroup)

  app.get("/users/:id/groups", auth, userController.getUserGroups)
  app.get("/groups/:id/users", auth, groupController.findUsersInSpecificGroup)

  app.post("/login", userController.login);
};

export default routes;