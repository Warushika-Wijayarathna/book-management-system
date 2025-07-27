import axios from "axios";
import { Lending } from "../types/Lending";

const API_URL = "/api/lendings";

export const getLendings = async (): Promise<Lending[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const lendBook = async (data: {
  readerId: string;
  bookId: string;
  days?: number;
}): Promise<Lending> => {
  const res = await axios.post(API_URL, data);
  return res.data.lending;
};

export const returnBook = async (lendingId: string): Promise<Lending> => {
  const res = await axios.patch(`${API_URL}/${lendingId}/return`);
  return res.data.lending;
};

