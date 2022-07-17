import "./index.sass";

interface AvatarListProps {
  max?: number;
  tooltip?: boolean;
  users: {
    name: string;
    src?: string;
  }[];
}

export default function AvatarList(props: AvatarListProps) {
  const { users, max, tooltip = false } = props;
  // const { length } = users;

  const renderedUsers = max ? users.slice(0, max) : users;

  return (
    <div className="flex -space-x-1 relative z-0">
      {renderedUsers.map((user, i) => {
        return (
          <div className="avatar relative group" key={i}>
            <img
              key={i}
              className="relative z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white"
              src={`${user.src || "../avatar_placeholder.png"}`}
              alt={user.name}
            />
            {tooltip && (
              <div className="avatar-tooltip absolute z-30 -top-6 -left-10 bg-gray-400 text-white rounded px-3 whitespace-nowrap">
                <span>{user.name}</span>
              </div>
            )}
          </div>
        );
      })}
      {Number(max) > 0 && users.length > Number(max) && (
        <div className="relative text-xs text-white bg-gray-500 z-30 inline-block h-6 w-6 rounded-full ring-2 ring-white flex align-center justify-center">
          +{users.length - Number(max)}
        </div>
      )}
    </div>
  );
}
