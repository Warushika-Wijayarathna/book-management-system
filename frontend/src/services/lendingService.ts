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
  const res = await apiClient.put(`/lendings/return/${lendingId}`);
  return res.data.lending;
};
