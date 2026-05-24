import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function MessageList({ messages, currentUserId }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      {messages.map((msg, index) => {
        const isCurrentUser = msg.senderId === currentUserId;
        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                isCurrentUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {!isCurrentUser && (
                <p className="text-xs font-semibold text-gray-500 mb-1">{msg.senderName}</p>
              )}
              <p className="break-words">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {msg.createdAt
                  ? new Date(msg.createdAt.toDate?.()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Just now'}
              </p>
            </div>
          </motion.div>
        );
      })}
      <div ref={endRef} />
    </motion.div>
  );
}

export default MessageList;