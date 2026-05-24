import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ChatList({ chats }) {
  const navigate = useNavigate();

  if (!chats || chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No chats yet</p>
          <p className="text-sm">Start a conversation with a user</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-2 p-4">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/chat/${chat.id}`)}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition transform hover:scale-102"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">{chat.name}</h3>
              <p className="text-sm text-gray-600">{chat.lastMessage || 'No messages yet'}</p>
            </div>
            {chat.unread && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ChatList;