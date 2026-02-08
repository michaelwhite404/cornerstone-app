// API Client
export { apiClient, extractData } from "./client";

// Devices
export {
  deviceKeys,
  useDevices,
  useDevice,
  useCreateDeviceError,
} from "./devices";

// Groups (Google Directory)
export {
  groupKeys,
  useGroups,
  useGroup,
  useCreateGroup,
} from "./groups";

// Leaves
export {
  leaveKeys,
  useLeaves,
  useLeave,
  useCreateLeave,
  useFinalizeLeave,
} from "./leaves";

// Students
export {
  studentKeys,
  useStudents,
  useStudent,
  useCreateStudent,
} from "./students";

// Textbooks
export {
  textbookKeys,
  useTextbooks,
  useCheckoutTextbooks,
  useCheckinTextbooks,
} from "./textbooks";

// Tickets
export {
  ticketKeys,
  useTickets,
  useTicket,
  useCreateTicket,
} from "./tickets";

// Users
export {
  userKeys,
  useUsers,
  useUser,
  useCurrentUser,
  useCurrentUserWithGroups,
  useUpdateUser,
} from "./users";
