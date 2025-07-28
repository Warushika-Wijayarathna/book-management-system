import apiClient from "./apiClient";
import { Lending } from "../types/Lending";


export const getLendings = async (): Promise<Lending[]> => {
  const res = await apiClient.get("/lendings");
  return res.data;
};

export const lendBook = async (data: {
  readerId: string;
  bookId: string;
  days?: number;
}): Promise<Lending> => {
  const res = await apiClient.post("/lendings", data);
  return res.data.lending;
};

export const returnBook = async (lendingId: string): Promise<Lending> => {
  console.log("returnBook called with lendingId:", lendingId);
  console.log("Making API call to:", `/lendings/return/${lendingId}`);

  const res = await apiClient.put(`/lendings/return/${lendingId}`);
  console.log("returnBook API response:", res.data);

  return res.data.lending;
};

export const getLendingsByBook = async (bookId: string): Promise<Lending[]> => {
  const res = await apiClient.get(`/lendings/book/${bookId}`);
  return res.data;
};
