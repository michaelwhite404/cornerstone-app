import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { TextbookModel } from "../types/models/textbookTypes";
import { TextbookSetModel } from "../types/models/textbookSetTypes";

// Query Keys
export const textbookKeys = {
  all: ["textbooks"] as const,
  sets: () => [...textbookKeys.all, "sets"] as const,
  setList: () => [...textbookKeys.sets(), "list"] as const,
  setBooks: (setId: string) => [...textbookKeys.sets(), setId, "books"] as const,
  books: () => [...textbookKeys.all, "books"] as const,
  bookList: () => [...textbookKeys.books(), "list"] as const,
};

// API Functions
const fetchTextbookSets = async () => {
  const response = await apiClient.get<{ data: { textbooks: TextbookSetModel[] } }>("/textbooks", {
    params: { sort: "title" },
  });
  return extractData(response).textbooks;
};

const fetchTextbookSetBooks = async (setId: string) => {
  const response = await apiClient.get<{ data: { books: TextbookModel[] } }>(
    `/textbooks/${setId}/books`
  );
  return extractData(response).books;
};

const fetchTextbooks = async () => {
  const response = await apiClient.get<{ data: { books: TextbookModel[] } }>("/textbooks/books", {
    params: {
      sort: "textbookSet,bookNumber",
      active: true,
      limit: 100000,
    },
  });
  return extractData(response).books;
};

interface CheckoutData {
  books: string[];
  student: string;
}

const checkoutTextbooks = async (data: CheckoutData) => {
  const response = await apiClient.post<{ data: { books: TextbookModel[] } }>(
    "/textbooks/books/checkout",
    data
  );
  return extractData(response).books;
};

interface CheckinData {
  books: { _id: string; quality: string }[];
}

const checkinTextbooks = async (data: CheckinData) => {
  const response = await apiClient.post<{ data: { books: TextbookModel[] } }>(
    "/textbooks/books/checkin",
    data
  );
  return extractData(response).books;
};

// Hooks
export const useTextbookSets = () => {
  return useQuery({
    queryKey: textbookKeys.setList(),
    queryFn: fetchTextbookSets,
  });
};

export const useTextbookSetBooks = (setId: string) => {
  return useQuery({
    queryKey: textbookKeys.setBooks(setId),
    queryFn: () => fetchTextbookSetBooks(setId),
    enabled: !!setId,
  });
};

export const useTextbooks = () => {
  return useQuery({
    queryKey: textbookKeys.bookList(),
    queryFn: fetchTextbooks,
  });
};

export const useCheckoutTextbooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutTextbooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.bookList() });
    },
  });
};

export const useCheckinTextbooks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkinTextbooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.bookList() });
    },
  });
};
