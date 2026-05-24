import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function UsersList({ users }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleStartChat = async (targetUser) => {
    if (!user) return;

    try {
      const chatId = [user.uid, targetUser.id].sort().join('_');
      const chatRef = doc(db, 'chats', chatId);

      await setDoc(
        chatRef,
        {
          participants: [user.uid, targetUser.id],
          participantNames: [user.displayName, targetUser.displayName],
          name: targetUser.displayName,
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success('Chat opened!');
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
    >
      {users.map((targetUser, index) => (
        <motion.div
          key={targetUser.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {targetUser.displayName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{targetUser.displayName}</h3>
              <p className="text-gray-500 text-sm truncate">{targetUser.email}</p>
            </div>
          </div>

          {targetUser.bio && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{targetUser.bio}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/profile/${targetUser.id}`)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              View Profile
            </button>
            <button
              onClick={() => handleStartChat(targetUser)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Message
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default UsersList;