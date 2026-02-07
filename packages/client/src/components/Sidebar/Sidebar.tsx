import { Link, useLocation } from "react-router-dom";
import ProfileButton from "../ProfileButton/ProfileButton";
import { createUserNavigation } from "../../navigation";
import "./Sidebar.sass";
import { useAuth } from "../../hooks";

export default function Sidebar(props: SidebarProps) {
  const location = useLocation();
  const user = useAuth().user!;
  const matchesURL = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);
  const navigation = createUserNavigation(user);

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <div className="sidebar-inner">
          <div className="logo-wrapper">
            <img className="brand-image" alt="Cornerstone Logo" src="/cstonealttest.png" />
          </div>
          <div className="profile-button-wrapper">{user && <ProfileButton user={user} />}</div>
          <div className="navigation-wrapper">
            <nav>
              <span className="idkyet">Navigation</span>
              <div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`navigation-item${matchesURL(item.href) ? " current" : ""}`}
                    aria-current={matchesURL(item.href)}
                    onClick={props.closeMenu}
                  >
                    <item.icon className="" aria-hidden="false" height={20} width={20} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  closeMenu?: () => void;
}
