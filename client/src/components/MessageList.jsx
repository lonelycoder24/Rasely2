import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

function MessageList({ messages, currentUserId }) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages && messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Start a conversation</p>
            <p className="text-sm">Send a message to get started</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === currentUserId
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-600'}`}>
                {message.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString() : 'Now'}
              </p>
            </div>
          </motion.div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}

export default MessageList;