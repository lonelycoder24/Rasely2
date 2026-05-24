import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function UsersList({ users }) {
  const navigate = useNavigate();

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No users found</p>
          <p className="text-sm">Check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => navigate(`/profile/${user.id}`)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user.displayName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user.displayName}</h3>
              <p className="text-xs text-green-600 font-semibold">● Online</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{user.bio || 'No bio yet'}</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
            View Profile
          </button>
        </motion.div>
      ))}
    </div>
  );
}

export default UsersList;