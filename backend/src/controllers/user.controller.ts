import {NextFunction, Request, Response} from "express"
import {UserModel} from "../models/User"
import {APIError} from "../errors/APIError"

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) {
            throw new APIError(404, "User not found")
        }
        res.status(200).json(user)
    } catch (error: any) {
        next(error)
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModel.find()
        res.status(200).json(users)
    } catch (error: any) {
        next(error)
    }
};
