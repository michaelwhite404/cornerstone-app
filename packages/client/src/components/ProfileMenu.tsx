import { Menu, MenuItem } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { useAuth, useSocket, useToasterContext } from "../hooks";

export default function ProfileMenu() {
  const { showToaster } = useToasterContext();
  const { logout } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout()
      .then(() => {
        showToaster("Logged out successfully", "success");
        socket?.disconnect();
      })
      .catch(() => showToaster("There was an error logging out", "danger"));
  };
  return (
    <Menu className="custom-pop">
      <MenuItem text="Profile" onClick={() => navigate("/profile")} />
      <MenuItem text="Log Out" onClick={handleLogout} />
    </Menu>
  );
}
