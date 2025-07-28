import apiClient from './apiClient'

export interface LibraryMetrics {
  totalBooks: number
  totalReaders: number
  activeBorrowings: number
  totalBorrowings: number
}

export interface MonthlyTrends {
  categories: string[]
  data: number[]
}

export interface LibraryStatistics {
  categories: string[]
  borrowings: number[]
  returns: number[]
}

export interface MonthlyTarget {
  current: number
  target: number
  percentage: number
}

export interface RecentBorrowing {
  id: string
  title: string
  author: string
  borrower: string
  dueDate: string
  status: 'borrowed' | 'returned' | 'overdue' | 'returnedLate'
}

export interface GenreStatistic {
  genre: string
  count: number
}

export const dashboardService = {
  getLibraryMetrics: async (): Promise<LibraryMetrics> => {
    const response = await apiClient.get('/dashboard/metrics')
    return response.data
  },

  getMonthlyBorrowingTrends: async (): Promise<MonthlyTrends> => {
    const response = await apiClient.get('/dashboard/monthly-borrowing-trends')
    return response.data
  },

  getLibraryStatistics: async (): Promise<LibraryStatistics> => {
    const response = await apiClient.get('/dashboard/library-statistics')
    return response.data
  },

  getMonthlyTarget: async (): Promise<MonthlyTarget> => {
    const response = await apiClient.get('/dashboard/monthly-target')
    return response.data
  },

  getRecentBorrowedBooks: async (): Promise<RecentBorrowing[]> => {
    const response = await apiClient.get('/dashboard/recent-borrowed-books')
    return response.data
  },

  getGenreStatistics: async (): Promise<GenreStatistic[]> => {
    const response = await apiClient.get('/dashboard/genre-statistics')
    return response.data
  }
}
