import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function UsersList({ users }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleStartChat = async (targetUser) => {
    try {
      // Check if chat already exists
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', user?.uid)
      );
      const snapshot = await getDocs(q);
      
      let chatId = null;
      snapshot.forEach(doc => {
        if (doc.data().participants.includes(targetUser.id)) {
          chatId = doc.id;
        }
      });

      // Create new chat if doesn't exist
      if (!chatId) {
        const docRef = await addDoc(chatsRef, {
          name: `${user?.displayName} & ${targetUser.displayName}`,
          participants: [user?.uid, targetUser.id],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: '',
          isGroup: false,
        });
        chatId = docRef.id;
      }

      navigate(`/chat/${chatId}`);
      toast.success('Chat opened!');
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No users found</p>
          <p className="text-sm">Be the first to join!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((profile, index) => (
        <motion.div
          key={profile.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
              {profile.displayName?.[0]?.toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{profile.displayName}</h3>
            <p className="text-sm text-gray-600 mb-3 truncate">{profile.email}</p>
            <p className="text-xs text-gray-500 mb-4">{profile.followers?.length || 0} followers</p>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
              >
                View
              </button>
              <button
                onClick={() => handleStartChat(profile)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                Message
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default UsersList;