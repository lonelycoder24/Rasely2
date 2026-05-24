import { motion } from 'framer-motion';

function MessageList({ messages, currentUserId }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
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
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {!isOwn && (
                  <p className="text-xs font-semibold mb-1 opacity-75">
                    {message.senderName}
                  </p>
                )}
                <p className="break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt?.toDate?.()).toLocaleTimeString(
                    [],
                    { hour: '2-digit', minute: '2-digit' }
                  ) || 'sending...'}
                </p>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}

export default MessageList;