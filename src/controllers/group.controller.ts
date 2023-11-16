import { Request, Response } from 'express';
import groupService from '../services/group.service';
import { GroupInput, GroupDocument } from '../models/group.model';
import bcrypt from 'bcrypt';
import userService from '../services/user.service';

class GroupController {
    /**
     * Checks if a group already exists, and if not, creates a new group and
     * returns it.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request made to
     * the server. It contains information such as the request method, headers, URL, and body.
     * @param {Response} res - The `res` parameter is an instance of the `Response` object, which
     * represents the HTTP response that will be sent back to the client. It is used to send the
     * response status code and data back to the client.
     * @returns a Promise that resolves to a Response object.
     */
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const groupExists: GroupDocument | null = await groupService.findByName(req.body.name);
            if (groupExists) {
                return res.status(400).json({ message: "Group already exists" });
            }

            const group: GroupDocument = await groupService.create(req.body as GroupInput);

            return res.status(201).json(group);

        } catch (error) {
            return res.status(500).json(error);
        }
    }


    /**
     * Retrieves all groups and returns them as a JSON response.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request made by
     * the client. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is an object representing the HTTP response that
     * will be sent back to the client. It is used to set the status code and send the response data.
     * @returns a Promise that resolves to a Response object.
     */
    public async findAll(req:Request, res:Response):Promise<Response>{
        try{
            const groups: GroupDocument[] = await groupService.findAll();
            
            return res.status(200).json(groups);
        }
        catch (error) {
            return res.status(500).json(error)
        }

    }

    /**
     * Updates a group with the given ID using the request body and returns the updated
     * group.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request made to
     * the server. It contains information such as the request method, headers, URL, and request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
     * response back to the client. It contains methods and properties that allow you to set the
     * response status code, headers, and body. In this code snippet, it is used to send the response
     * with the updated group object in
     * @returns a JSON response with the updated group document if it is found and updated
     * successfully. If the group is not found, a 404 status code with a message "Group not found" is
     * returned. If there is an error during the update process, a 500 status code with the error
     * message is returned.
     */
    public async update(req: Request, res: Response) {
        try {
            const group: GroupDocument | null = await groupService.findById(req.params.id);
            if (group === null) {
                return res.status(404).json({ message: "Group not found" });
            }
            
            const updatedGroup: GroupDocument | null = await groupService.update(group, req.body)

            return res.status(200).json(updatedGroup)

        } catch (error) {
            res.status(500).json(error);
        }
    }

    /**
     * Deletes a group by its ID and returns the deleted group if found, otherwise returns
     * a 404 error.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, URL, and any data sent
     * in the request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
     * response back to the client. It contains methods and properties that allow you to set the
     * response status code, headers, and body. In this code snippet, it is used to send the response
     * with the deleted group object in
     * @returns If the group is not found, a response with status code 404 and a message "Group not
     * found" is returned. If the group is found and successfully deleted, a response with status code
     * 200 and the deleted group document is returned. If there is an error, a response with status
     * code 500 and the error is returned.
     */
    public async delete(req: Request, res: Response) {
        try {
            const group: GroupDocument | null = await groupService.findById(req.params.id);

            if (group === null) {
                return res.status(404).json({ message: "Group not found" });
            }
            
            const deletedGroup: GroupDocument | null = await groupService.delete(req.params.id);

            return res.status(200).json(deletedGroup);

        } catch (error) {
            res.status(500).json(error);
        }
    }

    /**
     * Finds users in a specific group and returns them as a JSON response.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
     * response back to the client. It contains methods and properties that allow you to set the
     * response status, headers, and body. In this code snippet, it is used to send the response with
     * the appropriate status code and JSON
     * @returns If the group is not found, a response with status code 404 and a message "Group not
     * found" is returned. If the group is found, a response with status code 200 and an array of users
     * is returned. If there is an error, a response with status code 500 and the error object is
     * returned.
     */
    public async findUsersInSpecificGroup(req: Request, res: Response) {
        try{
            const group: GroupDocument | null = await groupService.findById(req.params.id);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            const users = await userService.findUsersById(group.users);
            return res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
    
}

export default new GroupController();