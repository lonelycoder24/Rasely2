import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function ChatList({ chats }) {
  const navigate = useNavigate();

  if (!chats || chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">No chats yet</p>
          <p className="text-gray-400">Start by selecting a user to message</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="divide-y divide-gray-200"
    >
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/chat/${chat.id}`)}
          className="bg-white p-4 hover:bg-blue-50 cursor-pointer transition border-l-4 border-transparent hover:border-blue-600"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
              {chat.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800">{chat.name}</h3>
              <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'No messages yet'}</p>
            </div>
            {chat.lastMessageTime && (
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {format(new Date(chat.lastMessageTime?.seconds * 1000), 'MMM d')}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ChatList;