import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function UsersList({ users }) {
  const navigate = useNavigate();

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No users found</p>
          <p className="text-sm">Check back later</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-lg font-bold mb-3">
            {user.displayName?.[0]?.toUpperCase()}
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">{user.displayName}</h3>
          <p className="text-sm text-gray-600 mb-3">{user.email}</p>
          <p className="text-xs text-gray-500">{user.followers?.length || 0} followers</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default UsersList;