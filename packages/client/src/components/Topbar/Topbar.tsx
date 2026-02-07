import { useState } from "react";
import { Drawer, Icon } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import ProfileMenu from "../ProfileMenu";
import "./Topbar.sass";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../hooks";

export default function Topbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="topbar">
      <button className="hamburger-button" type="button" onClick={() => setOpen(true)}>
        <Icon icon="menu" style={{ color: "#999999" }} />
      </button>
      <div className="profile-image-wrapper">
        <Popover2 content={<ProfileMenu />} placement="bottom-start" className="menu-popover">
          <button className="topbar-profile-button">
            <img src={user?.image} alt="Profile" />
          </button>
        </Popover2>
      </div>
      <Drawer
        position="left"
        size="256px"
        usePortal
        isOpen={open}
        hasBackdrop
        canOutsideClickClose={true}
        onClose={() => setOpen(false)}
      >
        <Sidebar closeMenu={close} />
      </Drawer>
    </div>
  );
}
