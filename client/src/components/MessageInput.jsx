import { useState } from 'react';
import { motion } from 'framer-motion';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    await onSendMessage(message);
    setMessage('');
    setSending(false);
  };

  return (
    <motion.form
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 bg-white flex gap-2"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={sending}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={sending || !message.trim()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </motion.form>
  );
}

export default MessageInput;