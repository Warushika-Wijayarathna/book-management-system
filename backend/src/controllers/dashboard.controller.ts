import { Request, Response, NextFunction } from "express"
import { BookModel } from "../models/Book"
import { LendingModel } from "../models/Lending"
import { ReaderModel } from "../models/Reader"

export const getLibraryMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalBooks = await BookModel.countDocuments()
        const totalReaders = await ReaderModel.countDocuments()
        const activeBorrowings = await LendingModel.countDocuments({
            status: { $in: ["borrowed", "overdue"] }
        })
        const totalBorrowings = await LendingModel.countDocuments()

        res.json({
            totalBooks,
            totalReaders,
            activeBorrowings,
            totalBorrowings
        })
    } catch (error) {
        next(error)
    }
}

export const getMonthlyBorrowingTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentYear = new Date().getFullYear()
        const monthlyData = await LendingModel.aggregate([
            {
                $match: {
                    borrowedDate: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$borrowedDate" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ])

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const data = new Array(12).fill(0)

        monthlyData.forEach(item => {
            data[item._id - 1] = item.count
        })

        res.json({
            categories: months,
            data: data
        })
    } catch (error) {
        next(error)
    }
}

export const getLibraryStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentYear = new Date().getFullYear()

        const borrowingsData = await LendingModel.aggregate([
            {
                $match: {
                    borrowedDate: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$borrowedDate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        const returnsData = await LendingModel.aggregate([
            {
                $match: {
                    returnedDate: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    },
                    status: { $in: ["returned", "returnedLate"] }
                }
            },
            {
                $group: {
                    _id: { $month: "$returnedDate" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ])

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const borrowings = new Array(12).fill(0)
        const returns = new Array(12).fill(0)

        borrowingsData.forEach(item => {
            borrowings[item._id - 1] = item.count
        })

        returnsData.forEach(item => {
            returns[item._id - 1] = item.count
        })

        res.json({
            categories: months,
            borrowings,
            returns
        })
    } catch (error) {
        next(error)
    }
}

export const getMonthlyBorrowingTarget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        const currentMonthBorrowings = await LendingModel.countDocuments({
            borrowedDate: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        })

        const totalBooks = await BookModel.countDocuments()
        const monthlyTarget = Math.max(Math.floor(totalBooks * 0.5), 1)

        const percentage = monthlyTarget > 0 ? (currentMonthBorrowings / monthlyTarget) * 100 : 0

        res.json({
            current: currentMonthBorrowings,
            target: monthlyTarget,
            percentage: Math.round(percentage * 100) / 100
        })
    } catch (error) {
        next(error)
    }
}

export const getRecentBorrowedBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recentBorrowings = await LendingModel.find()
            .populate({
                path: 'bookId',
                select: 'title author'
            })
            .populate({
                path: 'readerId',
                select: 'name'
            })
            .sort({ borrowedDate: -1 })
            .limit(10)

        const formattedData = recentBorrowings.map(lending => {
            const book = lending.bookId as { title?: string; author?: string } | null;
            const reader = lending.readerId as { name?: string } | null;
            return {
                id: lending._id,
                title: book?.title || 'Unknown',
                author: book?.author || 'Unknown',
                borrower: reader?.name || 'Unknown',
                dueDate: lending.dueDate.toISOString().split('T')[0],
                status: lending.status
            }
        })

        res.json(formattedData)
    } catch (error) {
        next(error)
    }
}

export const getGenreStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genreStats = await BookModel.aggregate([
            {
                $unwind: "$genres"
            },
            {
                $group: {
                    _id: "$genres",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ])

        res.json(genreStats.map(stat => ({
            genre: stat._id || 'Unknown',
            count: stat.count
        })))
    } catch (error) {
        next(error)
    }
}
