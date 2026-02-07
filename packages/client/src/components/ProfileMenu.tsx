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
    <div className="py-1">
      <button
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
      <button
        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}
