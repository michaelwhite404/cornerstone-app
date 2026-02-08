// API Client
export { apiClient, extractData } from "./client";

// Aftercare
export {
  aftercareKeys,
  useAftercareSession,
  useAftercareStats,
  useStudentAftercareEntries,
  useUpdateStudentAftercare,
} from "./aftercare";

// Departments
export {
  departmentKeys,
  useDepartments,
  useDepartment,
  useDepartmentsAllowingTickets,
  useCreateDepartment,
  useAddDepartmentMembers,
} from "./departments";

// Short URLs
export {
  shortUrlKeys,
  useShortUrls,
  useCreateShortUrl,
} from "./shortUrls";

// Devices
export {
  deviceKeys,
  useDevices,
  useDevice,
  useCreateDeviceError,
  useDeviceLogs,
  useDeviceStats,
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
  useUpdateStudentPasswords,
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
  useUpdateTicket,
  useCloseTicket,
} from "./tickets";

// Timesheets
export {
  timesheetKeys,
  useTimesheet,
  useCreateTimesheet,
  useUpdateTimesheet,
} from "./timesheets";

// Users
export {
  userKeys,
  useUsers,
  useUser,
  useCurrentUser,
  useCurrentUserWithGroups,
  useUpdateUser,
  useUpdatePassword,
  useGoogleUsers,
  useUpdateUserSetting,
} from "./users";
