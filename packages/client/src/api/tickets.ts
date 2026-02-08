import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, extractData } from "./client";
import { TicketModel } from "../types/models";

// Query Keys
export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: () => [...ticketKeys.lists()] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};

// API Functions
const fetchTickets = async () => {
  const response = await apiClient.get<{ data: { tickets: TicketModel[] } }>("/tickets");
  return extractData(response).tickets;
};

const fetchTicket = async (id: string) => {
  const response = await apiClient.get<{ data: { ticket: TicketModel } }>(`/tickets/${id}`);
  return extractData(response).ticket;
};

interface CreateTicketData {
  title: string;
  description: string;
  priority: string;
}

const createTicket = async (data: CreateTicketData) => {
  const response = await apiClient.post<{ data: { ticket: TicketModel } }>("/tickets", data);
  return extractData(response).ticket;
};

// Hooks
export const useTickets = () => {
  return useQuery({
    queryKey: ticketKeys.list(),
    queryFn: fetchTickets,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => fetchTicket(id),
    enabled: !!id,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
};
