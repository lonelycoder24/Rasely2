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
      className="w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-lg flex flex-col"
    >
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-2xl font-bold mb-2">Rasely</h1>
        <p className="text-blue-100 text-sm">Social Messenger</p>
      </div>

      <div className="flex-1 p-6">
        <div className="bg-blue-500 bg-opacity-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-100 mb-1">Logged in as</p>
          <p className="font-semibold truncate">{user?.displayName}</p>
          <p className="text-xs text-blue-100 truncate">{user?.email}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            🏠 Home
          </button>
          <button
            onClick={() => navigate(`/profile/${user?.uid}`)}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            👤 My Profile
          </button>
        </div>
      </div>

      <div className="p-6 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;