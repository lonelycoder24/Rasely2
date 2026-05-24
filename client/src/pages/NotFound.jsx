import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Go Home
        </button>
      </div>
    </motion.div>
  );
}

export default NotFound;