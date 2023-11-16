import { Request, Response } from 'express';
import userService from '../services/user.service';
import { UserInput, UserDocument } from '../models/user.model';
import bcrypt from 'bcrypt';
import groupService from '../services/group.service';
import { GroupDocument, GroupInput } from '../models/group.model';

class UserController {

    /**
     * Creates a new user, checks if the user already exists, hashes the password, and
     * returns the created user.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request made to
     * the server. It contains information such as the request method, headers, body, and query
     * parameters.
     * @param {Response} res - The `res` parameter is an instance of the `Response` object, which
     * represents the HTTP response that will be sent back to the client. It is used to send the
     * response data, set the status code, and perform other operations related to the response.
     * @returns a Promise that resolves to a Response object.
     */
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const userExists: UserDocument | null = await userService.findByEmail(req.body.email);
            if (userExists) {
                return res.status(400).json({ message: "User already exists" });
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user: UserDocument = await userService.create(req.body as UserInput);

            return res.status(201).json(user);

        } catch (error) {
            return res.status(500).json(error);
        }
    }


    /**
     * Finds a user by their ID and returns the user if found, or returns an error
     * message if not found.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by
     * the client. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
     * response back to the client. It contains methods and properties that allow you to set the
     * response status code, headers, and body. In this code snippet, it is used to send a JSON
     * response with the user data or
     * @returns If the user is found, the function will return a response with a status code of 200 and
     * the user object in JSON format. If the user is not found, the function will return a response
     * with a status code of 404 and a message indicating that the user was not found.
     */
    public async findById(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }


    /**
     * Updates a user's information, including their password if provided, and returns the
     * updated user.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, URL, and request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It contains methods and properties that allow you to set the status
     * code, headers, and send the response body.
     * @returns a JSON response with the updated user information if the user is found and updated
     * successfully. If the user is not found, a 404 status code with a message "User not found" is
     * returned. If there is an error during the process, a 500 status code with the error message is
     * returned.
     */
    public async update(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);
            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }
            if (req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const updateUser: UserDocument | null = await userService.update(user, req.body)

            return res.status(200).json(updateUser)

        } catch (error) {
            res.status(500).json(error);
        }
    }

    /**
     * Deletes a user by their ID and returns the deleted user.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, URL, and any data sent
     * in the request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It contains methods and properties that allow you to set the status
     * code, headers, and send the response body.
     * @returns If the user is not found, a response with status code 404 and a message "User not found"
     * is returned. If the user is found and successfully deleted, a response with status code 200 and
     * the deleted user object is returned. If there is an error, a response with status code 500 and
     * the error object is returned.
     */
    public async delete(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id);

            if (user === null) {
                return res.status(404).json({ message: "User not found" });
            }

            const deletedUser: UserDocument | null = await userService.delete(req.params.id);

            return res.status(200).json(deletedUser);

        } catch (error) {
            res.status(500).json(error);
        }

    }

    /**
     * Associates a user to a group by checking if the group and user
     * exist, checking if they are already associated, and then updating the user and group
     * accordingly.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, body, and query
     * parameters.
     * @param {Response} res - The `res` parameter is the response object that will be sent back to the
     * client. It is used to send the HTTP response with the appropriate status code and response body.
     * @returns a Promise that resolves to a Response object.
     */
    public async associateToGroup(req: Request, res: Response): Promise<Response> {
        try {
            const group: GroupDocument | null = await groupService.findById(req.body.groupId)
            const user: UserDocument | null = await userService.findById(req.body.userId)

            if (!group) {
                return res.status(404).json({ message: "Group with given id not found" })
            }

            if (!user) {
                return res.status(404).json({ message: "User with given id not found" })
            }

            const groupInUser: number = group.users.indexOf(user.id)
            const userInGroup: number = user.groups.indexOf(group.id)

            if (groupInUser != -1 && userInGroup != - 1) {
                return res.status(400).json({ message: "User is already associated to given group" })
            }

            if (groupInUser != -1 || userInGroup != -1) {
                return res.status(409).json({ message: "Inconsistent data, fix it first" })
            }

            const groupPre: GroupDocument = group.$clone()
            const userPre: UserDocument = user.$clone()

            try {
                userService.associateToGroup(user, group)
                return res.status(200).json({ user: user, group: group })
            }
            catch (error) {
                userService.update(userPre, userPre)//reverts user and group in case group update fails
                groupService.update(groupPre, groupPre)
                throw error
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }

    }

    /**
     * Is an asynchronous function that removes a user from a group and
     * handles various error cases.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, body, and query
     * parameters.
     * @param {Response} res - The `res` parameter is the response object that will be sent back to the
     * client. It is used to send the HTTP response with the appropriate status code and response body.
     * @returns a Promise that resolves to a Response object.
     */
    public async removeFromGroup(req: Request, res: Response): Promise<Response> {
        try {
            const group: GroupDocument | null = await groupService.findById(req.body.groupId)
            const user: UserDocument | null = await userService.findById(req.body.userId)

            if (!group) {
                return res.status(404).json({ message: "Group with given id not found" })
            }

            if (!user) {
                return res.status(404).json({ message: "User with given id not found" })
            }

            const groupInUser: number = group.users.indexOf(user.id)
            const userInGroup: number = user.groups.indexOf(group.id)

            if (groupInUser == -1 && userInGroup == -1) {
                return res.status(400).json({ message: "User is not associated to given group" })
            }

            if (groupInUser == -1 || userInGroup == -1) {
                return res.status(409).json({ message: "Inconsistent data, fix it first" })
            }

            const groupPre: GroupDocument = group.$clone()
            const userPre: UserDocument = user.$clone()

            try {
                userService.removeFromGroup(user, group)
                return res.status(200).json({ user: user, group: group })
            }
            catch (error) {
                userService.update(userPre, userPre)//reverts user and group in case update fails
                groupService.update(groupPre, groupPre)
                throw error
            }
        }
        catch (error) {
            return res.status(500).json(error);
        }

    }

    /**
     * Retrieves the groups associated with a user and returns them as a
     * JSON response.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
     * response back to the client. It contains methods and properties for setting the response status
     * code, headers, and body.
     * @returns a Promise that resolves to a Response object.
     */
    public async getUserGroups(req: Request, res: Response): Promise<Response> {
        try {
            const user: UserDocument | null = await userService.findById(req.params.id)

            if (!user) {
                return res.status(404).json({ message: "User with given id not found" })
            }

            const groups = await groupService.findManyByIds(user.groups)

            return res.status(200).json(groups)
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Checks if a user exists with the given email and password, and if so,
     * generates a token and returns it along with the user's email.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made by
     * the client. It contains information such as the request headers, request body, request method,
     * and request URL.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It contains methods and properties that allow you to set the status
     * code, headers, and send the response body.
     * @returns a response with status code 200 and sending an object with the user's email and token.
     */
    public async login(req: Request, res: Response) {
        try {
            const user: UserDocument | null = await userService.findByEmail(req.body.email);
            if (!user) {
                return res.status(401).json({ message: "Not authorized" });
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: "Not authorized" });
            }

            const token = await userService.generateToken(user);

            return res.status(200).send({ email: user.email, token })

        } catch (error) {
            res.status(500).json(error);
        }
    }
}

export default new UserController();