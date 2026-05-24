import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import MessageInput from '../components/MessageInput';
import MessageList from '../components/MessageList';
import { doc, getDoc, collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

function Chat() {
  const { chatId } = useParams();
  const { user } = useAuthStore();
  const { messages, setMessages, activeChat, setActiveChat } = useChatStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChat = async () => {
      if (!chatId) return;
      try {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          setActiveChat({ id: chatDoc.id, ...chatDoc.data() });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId, setActiveChat, navigate]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const unsubscribe = onSnapshot(
      query(messagesRef),
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs.sort((a, b) => a.createdAt - b.createdAt));
      },
      (error) => console.error('Error listening to messages:', error)
    );

    return () => unsubscribe();
  }, [chatId, setMessages]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !chatId || !user) return;

    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text,
        senderId: user.uid,
        senderName: user.displayName,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-white"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{activeChat?.name || 'Chat'}</h2>
          <p className="text-sm opacity-90">Active now</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-white hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition"
        >
          ← Back
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} currentUserId={user?.uid} />

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </motion.div>
  );
}

export default Chat;