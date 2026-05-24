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
      className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 flex flex-col"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rasely</h1>
        <p className="text-blue-100 text-sm">Social Messenger</p>
      </div>

      <div className="flex-1">
        <div className="bg-blue-500 bg-opacity-30 rounded-lg p-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold mb-2">
            {user?.displayName?.[0]?.toUpperCase()}
          </div>
          <p className="font-semibold">{user?.displayName}</p>
          <p className="text-sm text-blue-100">{user?.email}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate(`/profile/${user?.uid}`)}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            👤 My Profile
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            💬 Messages
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
      >
        Logout
      </button>
    </motion.nav>
  );
}

export default Navbar;