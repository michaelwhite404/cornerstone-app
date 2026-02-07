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
              onError={(e) => (e.currentTarget.src = "../avatar_placeholder.png")}
            />
            {tooltip && (
              <div
                className="avatar-tooltip absolute z-30 -top-7 bg-gray-400 text-white rounded px-3 min-w-max left-1/2"
                style={{ transform: "translate(-50%, 0)" }}
              >
                <div
                  className="bg-gray-400 w-2 h-2 -bottom-1 absolute left-1/2 z-10"
                  style={{ transform: "translate(-50%, 0) rotateZ(135deg)" }}
                />
                <span className="relative z-20 block">{user.name}</span>
              </div>
            )}
          </div>
        );
      })}
      {Number(max) > 0 && users.length > Number(max) && (
        <div className="relative text-xs text-white bg-gray-500 z-30 h-6 w-6 rounded-full ring-2 ring-white flex align-center justify-center">
          +{users.length - Number(max)}
        </div>
      )}
    </div>
  );
}
