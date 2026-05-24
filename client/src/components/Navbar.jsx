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
      toast.error('Logout failed');
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white p-6 flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rasely</h1>
        <p className="text-blue-100 text-sm">Social Messenger</p>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
          <span className="text-xl font-bold">{user?.displayName?.[0]?.toUpperCase()}</span>
        </div>
        <p className="font-semibold">{user?.displayName}</p>
        <p className="text-sm text-blue-100 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1">
        <button
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition mb-2"
        >
          💬 Chats
        </button>
        <button
          onClick={() => navigate(`/profile/${user?.uid}`)}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition mb-2"
        >
          👤 My Profile
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
        >
          🔍 Discover
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Logout
      </button>
    </motion.div>
  );
}

export default Navbar;