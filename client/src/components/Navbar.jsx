import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, setUser } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <motion.nav
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-6 h-screen flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rasely</h1>
        <p className="text-blue-100 text-sm">Social Messenger</p>
      </div>

      <div className="flex-1">
        <button
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition mb-2"
        >
          💬 Messages
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition mb-2"
        >
          👥 Users
        </button>
        <button
          onClick={() => navigate(`/profile/${user?.uid}`)}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          👤 Profile
        </button>
      </div>

      <div className="border-t border-blue-500 pt-4">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-bold">
              {user?.displayName?.[0]?.toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">{user?.displayName}</p>
              <p className="text-xs text-blue-100">Online</p>
            </div>
          </button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-16 left-0 right-0 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <button
                onClick={() => navigate(`/profile/${user?.uid}`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                View Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600 font-semibold"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;