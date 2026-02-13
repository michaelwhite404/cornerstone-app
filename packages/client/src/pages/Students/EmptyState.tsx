import { ChevronRightIcon } from "@heroicons/react/solid";
import { PlusCircleIcon, RefreshIcon, BanIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Link } from "react-router-dom";
import FadeIn from "../../components/FadeIn";
import Badge from "../../components/Badge/Badge";

const items: INavItem[] = [
  {
    name: "Create Student",
    description: "Create a new student",
    href: "add",
    iconColor: "bg-blue-500",
    icon: PlusCircleIcon,
  },
  {
    name: "Reset Passwords",
    description: "Reset the passwords of a students or all students in a class",
    href: "#",
    iconColor: "bg-purple-500",
    icon: RefreshIcon,
    comingSoon: true,
  },
  {
    name: "Deactive Students",
    description: "Remove students from the active roster",
    href: "##",
    iconColor: "bg-red-500",
    icon: BanIcon,
    comingSoon: true,
  },
];

export default function EmptyState() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div className="px-5">
        <h2 className="text-lg font-medium text-gray-900">Students</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a student or pick from one of the options below
        </p>
        <ul className="mt-6 border-t border-b border-gray-200 divide-y divide-gray-200">
          <FadeIn>
            {items.map((item, itemIdx) => (
              <NavItem key={item.href} item={item} />
            ))}
          </FadeIn>
        </ul>
      </div>
    </div>
  );
}

const NavItem = ({ item }: { item: INavItem }) => {
  return (
    <li>
      <div
        className={`relative group py-4 flex items-start space-x-3 ${
          item.comingSoon ? "grayscale opacity-30" : ""
        }`}
      >
        <div className="flex-shrink-0">
          <span
            className={classNames(
              item.iconColor,
              "inline-flex items-center justify-center h-10 w-10 rounded-lg"
            )}
          >
            <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900">
            {item.comingSoon ? (
              <div className="flex justify-between">
                {item.name}
                <Badge text="COMING SOON" color="gray" noDot />
              </div>
            ) : (
              <Link to={item.href} className="no-underline">
                <span className="absolute inset-0" aria-hidden="true" />
                {item.name}
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-500 m-0">{item.description}</p>
        </div>
        <div className="flex-shrink-0 self-center">
          <ChevronRightIcon
            className={`h-5 w-5 text-gray-400 ${
              item.comingSoon ? "group-hover:text-gray-500" : ""
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    </li>
  );
};

interface INavItem {
  name: string;
  description: string;
  href: string;
  iconColor: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  comingSoon?: boolean;
}
