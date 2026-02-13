// API Client
export { apiClient, extractData } from "./client";

// Aftercare
export {
  aftercareKeys,
  useAftercareSession,
  useAftercareStats,
  useAftercareStudents,
  useStartSession,
  useStudentAftercareEntries,
  useTodaySession,
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
  useDeleteDepartmentMember,
  useUpdateDepartmentMember,
  useAvailableSettings,
  useDepartmentSettings,
  useMyDepartmentLeaders,
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
  useDeviceWithActions,
  useCreateDeviceError,
  useDeviceLogs,
  useDeviceStats,
  useGoogleDevice,
  useChromeOsVersion,
  useCheckoutDevice,
  useCheckinDevice,
  useAssignDevice,
  useUnassignDevice,
  useUpdateDeviceError,
  useResetDevice,
  useCreateDevice,
} from "./devices";

// Groups (Google Directory)
export {
  groupKeys,
  useGroups,
  useGroup,
  useCreateGroup,
  useAddGroupMembers,
  useUpdateGroup,
} from "./groups";

// Leaves
export {
  leaveKeys,
  useLeaves,
  useLeave,
  useCreateLeave,
  useFinalizeLeave,
  useGenerateLeaveReport,
} from "./leaves";

// Students
export {
  studentKeys,
  useStudents,
  useStudent,
  useCreateStudent,
  useUpdateStudentPasswords,
  useStudentsByGrade,
  useClassSelection,
} from "./students";

// Textbooks
export {
  textbookKeys,
  useTextbookSets,
  useTextbookSetBooks,
  useTextbooks,
  useCheckoutTextbooks,
  useCheckinTextbooks,
  useLegacyCheckoutTextbook,
  useLegacyCheckinTextbook,
  useCreateSetAndBooks,
  useTextbookActions,
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
  useTimesheets,
  useTimesheet,
  useCreateTimesheet,
  useUpdateTimesheet,
  useFinalizeTimesheets,
} from "./timesheets";

// Reimbursements
export {
  reimbursementKeys,
  useReimbursements,
  useFinalizeReimbursement,
  useCreateReimbursement,
} from "./reimbursements";

// Users
export {
  userKeys,
  useUsers,
  useUser,
  useCurrentUser,
  useCurrentUserWithGroups,
  useCreateUser,
  useUpdateUser,
  useUpdatePassword,
  useGoogleUsers,
  useUpdateUserSetting,
} from "./users";
