import {NextFunction, Request, Response} from "express"
import {LendingModel} from "../models/Lending"

export const getOverdueReaders = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const today = new Date()

        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            status: "borrowed"
        }).populate("readerId")

        const readerMap = new Map<string, any>()
        overdueLendings.forEach(lending => {
            const reader = lending.readerId as any;
            if (!readerMap.has(reader._id.toString())) {
                readerMap.set(reader._id.toString(), {
                    reader,
                    books: []
                })
            }
            readerMap.get(reader._id.toString()).books.push(lending)
        })

        const result = Array.from(readerMap.values())
        res.json(result)

    } catch (error) {
        next(error)
    }
}

export const getOverdueByReader = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const readerId = req.params.readerId;
        const today = new Date()

        const overdue = await LendingModel.find({
            readerId,
            dueDate: { $lt: today },
            status: "borrowed"
        }).populate("bookId")

        res.json(overdue)
    } catch (error) {
        next(error)
    }
}
