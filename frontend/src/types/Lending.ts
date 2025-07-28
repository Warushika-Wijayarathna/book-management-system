export interface Lending {
  _id?: string;
  readerId: string;
  bookId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate?: string;
  status: "borrowed" | "returned" | "overdue" | "returnedLate";
}
