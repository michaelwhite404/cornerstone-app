import { Link, useLocation } from "react-router-dom";
import ProfileButton from "../ProfileButton/ProfileButton";
import { createUserNavigation } from "../../navigation";
import { useAuth } from "../../hooks";

export default function Sidebar(props: SidebarProps) {
  const location = useLocation();
  const user = useAuth().user!;
  const matchesURL = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);
  const navigation = createUserNavigation(user);

  return (
    <div className="flex-shrink-0">
      <div className="flex flex-col w-64 h-full flex-grow bg-white border border-gray-200">
        <div className="pt-[25px] flex flex-col overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img className="h-16 mb-5" alt="Cornerstone Logo" src="/cstonealttest.png" />
          </div>
          <div className="px-4 pb-2.5 border-b border-gray-200">
            {user && <ProfileButton user={user} />}
          </div>
          <div>
            <nav className="py-5 px-4">
              <span className="text-[11px] uppercase tracking-[0.5px] font-medium text-[#a9b9d1] select-none">
                Navigation
              </span>
              <div className="mt-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex no-underline w-auto py-2 px-2.5 rounded-lg mt-1 text-sm font-medium text-gray-500 ${
                      matchesURL(item.href)
                        ? "bg-blue-50 text-[#4d8ac3]"
                        : "hover:bg-white"
                    }`}
                    aria-current={matchesURL(item.href)}
                    onClick={props.closeMenu}
                  >
                    <item.icon className="w-5 mr-2.5" aria-hidden="false" height={20} width={20} />
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
