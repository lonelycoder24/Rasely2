import { useState } from 'react';
import { motion } from 'framer-motion';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <motion.form
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white border-t border-gray-200 p-4 flex gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        Send
      </button>
    </motion.form>
  );
}

export default MessageInput;