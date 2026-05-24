import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRef, useEffect } from 'react';

function MessageList({ messages, currentUserId }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
    >
      {messages && messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isOwn = message.senderId === currentUserId;
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                }`}
              >
                {!isOwn && <p className="text-xs font-semibold mb-1">{message.senderName}</p>}
                <p className="break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.createdAt && format(new Date(message.createdAt.seconds * 1000), 'HH:mm')}
                </p>
              </div>
            </motion.div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </motion.div>
  );
}

export default MessageList;