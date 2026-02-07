import { SelectorIcon } from "@heroicons/react/solid";
import { Popover2 } from "@blueprintjs/popover2";
import "./ProfileButton.sass";
import { EmployeeModel } from "../../types/models/employeeTypes";
import ProfileMenu from "../ProfileMenu";

interface ProfileButtonProps {
  user: EmployeeModel;
}

export default function ProfileButton({ user }: ProfileButtonProps) {
  return (
    <Popover2 content={<ProfileMenu />} placement="bottom" className="menu-popover">
      <button className="profile-button">
        <span className="profile-button-inner">
          <span className="profile-button-content">
            <img src={user.image} alt="Profile" />
            <span className="profile-button-text">
              <div className="profile-name">{user.fullName}</div>
              <span>{user.title}</span>
            </span>
          </span>
          <SelectorIcon color="gray" width={20} />
        </span>
      </button>
    </Popover2>
  );
}
