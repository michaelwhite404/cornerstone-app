import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { TextbookModel } from "../types/models/textbookTypes";

// Query Keys
export const textbookKeys = {
  all: ["textbooks"] as const,
  books: () => [...textbookKeys.all, "books"] as const,
  bookList: () => [...textbookKeys.books(), "list"] as const,
};

// API Functions
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
