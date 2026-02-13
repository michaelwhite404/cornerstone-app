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

// Legacy textbook mutations (used by TextbooksTest pages)
interface LegacyCheckoutData {
  book: string;
  student: string;
}

const legacyCheckoutTextbook = async (data: LegacyCheckoutData[]) => {
  const response = await apiClient.post<{ message: string }>("/textbooks/books/check-out", {
    data,
  });
  return response.data.message;
};

export const useLegacyCheckoutTextbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: legacyCheckoutTextbook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.all });
    },
  });
};

interface LegacyCheckinData {
  id: string;
  quality: string;
}

const legacyCheckinTextbook = async (data: LegacyCheckinData[]) => {
  const response = await apiClient.patch<{ message: string }>("/textbooks/books/check-in", {
    books: data,
  });
  return response.data.message;
};

export const useLegacyCheckinTextbook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: legacyCheckinTextbook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.all });
    },
  });
};

interface Prebook {
  bookNumber: number;
  quality: string;
}

interface CreateSetAndBooksData {
  title: string;
  class: string;
  grade: number | string;
  books: Prebook[];
}

const createSetAndBooks = async (data: CreateSetAndBooksData) => {
  const response = await apiClient.post<{ data: { textbook: TextbookSetModel; books: TextbookModel[] } }>(
    "/textbooks/books/both",
    data
  );
  return extractData(response);
};

export const useCreateSetAndBooks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSetAndBooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.all });
    },
  });
};

// Add books to existing textbook set
interface AddBooksData {
  textbookSetId: string;
  books: Prebook[];
}

const addBooksToSet = async ({ textbookSetId, books }: AddBooksData) => {
  const response = await apiClient.post<{ data: { books: TextbookModel[] } }>(
    `/textbooks/${textbookSetId}/books/bulk`,
    { books }
  );
  return extractData(response).books;
};

export const useAddBooksToSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBooksToSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: textbookKeys.all });
    },
  });
};

// Composite hook for legacy textbook operations
export function useTextbookActions() {
  const checkoutMutation = useLegacyCheckoutTextbook();
  const checkinMutation = useLegacyCheckinTextbook();
  const createMutation = useCreateSetAndBooks();

  const checkoutTextbook = (data: LegacyCheckoutData[]) => {
    return checkoutMutation.mutateAsync(data);
  };

  const checkinTextbook = (data: LegacyCheckinData[]) => {
    return checkinMutation.mutateAsync(data);
  };

  const createSetAndBooksFn = (data: CreateSetAndBooksData) => {
    return createMutation.mutateAsync(data);
  };

  return {
    checkoutTextbook,
    checkinTextbook,
    createSetAndBooks: createSetAndBooksFn,
    // Also expose mutation states if needed
    isCheckingOut: checkoutMutation.isPending,
    isCheckingIn: checkinMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
