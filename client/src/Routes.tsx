import { Routes as ReactRoutes, Route, Navigate } from "react-router-dom";
import AppContainer from "./AppContainer";
import { useAuth } from "./hooks";
import Dashboard from "./pages/Dashboard/Dashboard";
import Devices from "./pages/Devices/Devices";
import AddDevice from "./pages/DeviceType2/AddDevice";
import DeviceData from "./pages/DeviceType2/DeviceData";
import DeviceEmptyState from "./pages/DeviceType2/DeviceEmptyState";
import DeviceType2 from "./pages/DeviceType2/DeviceType2";
import CurrentSession from "./pages/LionsDen/CurrentSession";
import LionsDen from "./pages/LionsDen/LionsDen";
import LionsDenStudents from "./pages/LionsDen/LionsDenStudents";
import Sessions from "./pages/LionsDen/Sessions";
import TextbooksTest from "./pages/TextbooksTest/TextbooksTest";
import Tools from "./pages/Tools";
import * as Page from "./pages";

export default function Routes() {
  const user = useAuth().user!;

  return (
    <ReactRoutes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="students" element={<Page.Students />}>
          <Route index element={<Page.Students.EmptyState />} />
          <Route path="add" element={<Page.Students.CreateStudent />} />
          <Route path=":slug" element={<Page.Students.StudentDetails />} />
        </Route>
        <Route path="textbooks" element={<TextbooksTest />} />
        <Route path="devices" element={<Devices />} />
        <Route path="/devices/:deviceType" element={<DeviceType2 />}>
          <Route index element={<DeviceEmptyState />} />
          <Route path="add" element={<AddDevice />} />
          <Route path=":slug" element={<DeviceData />} />
        </Route>
        {(user.timesheetEnabled || user.departments?.some((dept) => dept.role === "LEADER")) && (
          <Route path="timesheet" element={<Page.Timesheet />} />
        )}
        {user.departments && user.departments.find((dept) => dept.name === "Lions Den") && (
          <Route path="lions-den" element={<LionsDen />}>
            <Route index element={<CurrentSession />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="students" element={<LionsDenStudents />} />
          </Route>
        )}
        <Route path="tools">
          <Route index element={<Tools />} />
          <Route path="short-url" element={<Tools.ShortUrl />} />
        </Route>
        <Route path="tickets">
          <Route index element={<Page.Tickets />} />
          <Route path=":ticketId" element={<Page.Tickets.TicketDetails />} />
        </Route>
        <Route path="requests">
          <Route index element={<Page.Requests />} />
          <Route path="leaves" element={<Page.Requests.Leaves />} />
          <Route path="reimbursements" element={<Page.Requests.Reimbursements />} />
        </Route>
        {["Admin", "Super Admin"].includes(user.role) && (
          <Route>
            <Route path="users" element={<Page.Users />}>
              <Route index element={<Page.Users.Users />} />
              <Route path="departments" element={<Page.Users.Departments />} />
              <Route path="groups" element={<Page.Users.Groups />} />
            </Route>
            <Route path="users/departments/:id" element={<Page.Users.Departments.Detail />} />
            <Route path="users/:slug" element={<Page.Users.UserData />} />
            <Route path="users/groups/:slug" element={<Page.Users.GroupData />} />
          </Route>
        )}
        <Route path="profile" element={<Page.Profile />} />
      </Route>
    </ReactRoutes>
  );
}
