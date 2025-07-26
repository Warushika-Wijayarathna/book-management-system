import apiClient from "./apiClient";
import { Reader, ReaderFormData } from "../types/Reader";

export const getReaders = async (): Promise<Reader[]> => {
  const res = await apiClient.get("/readers");
  return res.data;
};

export const getReaderById = async (id: string): Promise<Reader> => {
  const res = await apiClient.get(`/readers/${id}`);
  return res.data;
};

export const addReader = async (data: ReaderFormData): Promise<Reader> => {
  const res = await apiClient.post("/readers", data);
  return res.data.reader;
};

export const updateReader = async (id: string, data: ReaderFormData): Promise<Reader> => {
  const res = await apiClient.put(`/readers/${id}`, data);
  return res.data.reader;
};

export const deleteReader = async (id: string): Promise<Reader> => {
  const res = await apiClient.delete(`/readers/${id}`);
  return res.data.reader;
};

