import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { ShortUrlModel } from "../types/models";

// Query Keys
export const shortUrlKeys = {
  all: ["shortUrls"] as const,
  lists: () => [...shortUrlKeys.all, "list"] as const,
  list: () => [...shortUrlKeys.lists()] as const,
};

// API Functions
const fetchShortUrls = async () => {
  const response = await apiClient.get<{ data: { shortUrls: ShortUrlModel[] } }>("/short");
  return extractData(response).shortUrls;
};

interface CreateShortUrlData {
  full: string;
  short: string;
}

const createShortUrl = async (data: CreateShortUrlData) => {
  const response = await apiClient.post<{ data: { shortUrl: ShortUrlModel } }>("/short", data);
  return extractData(response).shortUrl;
};

// Hooks
export const useShortUrls = () => {
  return useQuery({
    queryKey: shortUrlKeys.list(),
    queryFn: fetchShortUrls,
  });
};

export const useCreateShortUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShortUrl,
    onSuccess: (newUrl) => {
      // Prepend new URL to the cache
      queryClient.setQueryData<ShortUrlModel[]>(shortUrlKeys.list(), (oldUrls) => {
        if (!oldUrls) return [newUrl];
        return [newUrl, ...oldUrls];
      });
    },
  });
};
