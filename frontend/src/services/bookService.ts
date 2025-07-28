import type { Book } from "../types/Book";
import apiClient from "./apiClient";

export const getBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get("/books");
  return response.data;
};

export const addBook = async (bookData: { imageUrl: string }): Promise<Book> => {
  const response = await apiClient.post("/books", bookData);
  return response.data;
};

export const updateBook = async (id: string, bookData: { imageUrl: string }): Promise<Book> => {
  const response = await apiClient.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/books/${id}`);
  return response.data;
};

