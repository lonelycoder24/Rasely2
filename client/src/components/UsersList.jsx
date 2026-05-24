import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function UsersList({ users }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleStartChat = async (selectedUser) => {
    try {
      // Create a chat ID from both user IDs
      const chatId = [user.uid, selectedUser.id].sort().join('_');
      
      // Check if chat exists, if not create it
      await setDoc(
        doc(db, 'chats', chatId),
        {
          name: selectedUser.displayName,
          participants: [user.uid, selectedUser.id],
          createdAt: serverTimestamp(),
          lastMessage: '',
        },
        { merge: true }
      );

      toast.success('Chat started!');
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">No users found</p>
          <p className="text-sm">Try searching for someone</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user.displayName?.[0]?.toUpperCase()}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-1">{user.displayName}</h3>
            <p className="text-sm text-gray-600 mb-4">{user.followers?.length || 0} followers</p>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{user.bio || 'No bio'}</p>
            <div className="flex gap-2 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartChat(user)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Chat
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default UsersList;