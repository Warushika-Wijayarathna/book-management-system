import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { dashboardService, RecentBorrowing } from "../../services/dashboardService";

export default function RecentBorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState<RecentBorrowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getRecentBorrowedBooks();
        setBorrowedBooks(data);
      } catch (error) {
        console.error('Error fetching recent borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "returned":
      case "returnedLate":
        return "success";
      case "overdue":
        return "error";
      case "borrowed":
        return "warning";
      default:
        return "warning";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "returnedLate":
        return "Returned Late";
      case "borrowed":
        return "Borrowed";
      case "returned":
        return "Returned";
      case "overdue":
        return "Overdue";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recently Borrowed Books
            </h3>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recently Borrowed Books
            </h3>
            <p className="text-sm text-gray-500">Latest {borrowedBooks.length} borrowing activities</p>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Title
                </TableCell>
                <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Author
                </TableCell>
                <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Borrower
                </TableCell>
                <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Due Date
                </TableCell>
                <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {borrowedBooks.length === 0 ? (
                <TableRow>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No recent borrowings found
                  </td>
                </TableRow>
              ) : (
                borrowedBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {book.title}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {book.author}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {book.borrower}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {new Date(book.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                          size="sm"
                          color={getBadgeColor(book.status)}
                      >
                        {formatStatus(book.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
