import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin_directory_v1 } from "googleapis";
import { apiClient, extractData } from "./client";
import { GroupModel } from "../types/models";

type GoogleGroup = admin_directory_v1.Schema$Group;

// Query Keys
export const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  list: () => [...groupKeys.lists()] as const,
  details: () => [...groupKeys.all, "detail"] as const,
  detail: (email: string) => [...groupKeys.details(), email] as const,
};

// API Functions
const fetchGroups = async () => {
  const response = await apiClient.get<{ data: { groups: GoogleGroup[] } }>("/groups");
  const groups = extractData(response).groups;
  // Sort by name
  return groups.sort((a, b) => {
    const nameA = (a.name || "").toUpperCase();
    const nameB = (b.name || "").toUpperCase();
    return nameA.localeCompare(nameB);
  });
};

const fetchGroup = async (email: string) => {
  const response = await apiClient.get<{ data: { group: GroupModel } }>(`/groups/${email}`);
  return extractData(response).group;
};

interface CreateGroupData {
  name: string;
  email: string;
  description: string;
}

const createGroup = async (data: CreateGroupData) => {
  const response = await apiClient.post<{ data: { group: GoogleGroup } }>("/groups", data);
  return extractData(response).group;
};

interface AddGroupMembersData {
  groupEmail: string;
  users: { email: string; role: string }[];
}

const addGroupMembers = async ({ groupEmail, users }: AddGroupMembersData) => {
  const emailStart = groupEmail.replace("@cornerstone-schools.org", "");
  const response = await apiClient.post<{
    data: { members: admin_directory_v1.Schema$Member[] };
  }>(`/groups/${emailStart}/members`, { users });
  return extractData(response).members;
};

// Hooks
export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.list(),
    queryFn: fetchGroups,
  });
};

export const useGroup = (email: string) => {
  return useQuery({
    queryKey: groupKeys.detail(email),
    queryFn: () => fetchGroup(email),
    enabled: !!email,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (newGroup) => {
      // Add the new group to the cache and re-sort
      queryClient.setQueryData<GoogleGroup[]>(groupKeys.list(), (oldGroups) => {
        if (!oldGroups) return [newGroup];
        return [...oldGroups, newGroup].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      });
    },
  });
};

export const useAddGroupMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addGroupMembers,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupKeys.detail(variables.groupEmail.replace("@cornerstone-schools.org", "")),
      });
    },
  });
};
