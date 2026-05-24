import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import Navbar from '../components/Navbar';
import ChatList from '../components/ChatList';
import UsersList from '../components/UsersList';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
  const { user } = useAuthStore();
  const { setChats, chats } = useChatStore();
  const [tab, setTab] = useState('chats');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch user's chats from Firestore
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef);
        const snapshot = await getDocs(q);
        const chatsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChats(chatsList);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, setChats]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (tab !== 'users') return;
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const snapshot = await getDocs(q);
        const usersList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(u => u.id !== user?.uid);
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tab, user]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setTab('chats')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === 'chats'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setTab('users')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                tab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : tab === 'chats' ? (
            <ChatList chats={chats} />
          ) : (
            <UsersList users={users} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;