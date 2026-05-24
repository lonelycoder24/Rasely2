import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ChatList({ chats }) {
  const navigate = useNavigate();

  if (!chats || chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-xl mb-2">No chats yet</p>
          <p className="text-sm">Start a conversation with someone!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2 p-4"
    >
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/chat/${chat.id}`)}
          className="p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition transform hover:scale-102"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{chat.name}</h3>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage || 'No messages yet'}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
              {chat.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ChatList;