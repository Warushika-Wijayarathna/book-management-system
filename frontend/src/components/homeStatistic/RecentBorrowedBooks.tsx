import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

interface BorrowedBook {
  id: number;
  title: string;
  author: string;
  borrower: string;
  dueDate: string;
  status: "Returned" | "Overdue" | "Borrowed";
}

const borrowedBooks: BorrowedBook[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    borrower: "John Doe",
    dueDate: "2023-10-15",
    status: "Borrowed",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    borrower: "Jane Smith",
    dueDate: "2023-10-10",
    status: "Overdue",
  },
];

export default function RecentBorrowedBooks() {
  return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Recently Borrowed Books
            </h3>
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
              {borrowedBooks.map((book) => (
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
                      {book.dueDate}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge
                          size="sm"
                          color={
                            book.status === "Returned"
                                ? "success"
                                : book.status === "Overdue"
                                    ? "error"
                                    : "warning"
                          }
                      >
                        {book.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}
