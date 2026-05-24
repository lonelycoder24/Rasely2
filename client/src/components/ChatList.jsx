import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function ChatList({ chats }) {
  const navigate = useNavigate();

  if (!chats || chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">No chats yet</p>
          <p className="text-sm">Start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => navigate(`/chat/${chat.id}`)}
          className="p-4 hover:bg-gray-100 cursor-pointer transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
              {chat.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{chat.name}</h3>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage || 'Start a conversation'}</p>
            </div>
            <div className="text-xs text-gray-500">{chat.updatedAt}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ChatList;