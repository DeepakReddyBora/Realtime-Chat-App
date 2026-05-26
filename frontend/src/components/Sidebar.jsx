function Sidebar({
  users,
  selectedUser,
  setSelectedUser,
  onlineUsers,
  handleLogout,
}) {
  return (
    <div
      className={`${
        selectedUser
          ? "hidden md:flex"
          : "flex"
      } w-full md:w-75 bg-white border-r p-4 flex-col`}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Chats
        </h1>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-3 py-1 rounded hover:opacity-90"
        >
          Logout
        </button>

      </div>

      {/* Users */}
      <div className="flex flex-col gap-2 overflow-y-auto">

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`p-3 rounded cursor-pointer transition ${
              selectedUser?._id === user._id
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    selectedUser?._id === user._id
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  {user.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

                {/* Username */}
                <span>{user.username}</span>

              </div>

              {/* Online Indicator */}
              {onlineUsers.includes(user._id) && (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              )}

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Sidebar;