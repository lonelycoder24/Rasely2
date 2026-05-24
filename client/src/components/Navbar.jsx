import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Navbar() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <motion.nav
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-white border-opacity-20">
        <h1 className="text-3xl font-bold">Rasely</h1>
        <p className="text-sm text-blue-100">Social Messenger</p>
      </div>

      {/* User Info */}
      {user && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate(`/profile/${user.uid}`)}
          className="p-4 bg-white bg-opacity-10 cursor-pointer hover:bg-opacity-20 transition"
        >
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center mb-3 text-lg font-bold">
            {user.displayName?.[0]?.toUpperCase()}
          </div>
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-xs text-blue-100">{user.email}</p>
        </motion.div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition font-semibold mb-2"
        >
          💬 Chats
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-20 transition font-semibold"
        >
          👥 Users
        </motion.button>
      </div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={handleLogout}
        className="m-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
      >
        🚪 Logout
      </motion.button>
    </motion.nav>
  );
}

export default Navbar;