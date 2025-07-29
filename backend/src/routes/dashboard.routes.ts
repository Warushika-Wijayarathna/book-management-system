import { Router } from "express"
import { authenticateToken } from "../middlewares/authenticateToken"
import {
    getLibraryMetrics,
    getMonthlyBorrowingTrends,
    getLibraryStatistics,
    getMonthlyBorrowingTarget,
    getRecentBorrowedBooks,
    getGenreStatistics
} from "../controllers/dashboard.controller"

const router = Router()

router.use(authenticateToken)

router.get("/metrics", getLibraryMetrics)
router.get("/monthly-borrowing-trends", getMonthlyBorrowingTrends)
router.get("/library-statistics", getLibraryStatistics)
router.get("/monthly-target", getMonthlyBorrowingTarget)
router.get("/recent-borrowed-books", getRecentBorrowedBooks)
router.get("/genre-statistics", getGenreStatistics)

export default router
