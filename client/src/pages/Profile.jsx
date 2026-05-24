import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

function Profile() {
  const { userId } = useParams();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = { id: userDoc.id, ...userDoc.data() };
          setProfile(userData);
          setBio(userData.bio || '');
          setFollowers(userData.followers || []);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const handleUpdateBio = async () => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, 'users', userId), { bio });
      setProfile({ ...profile, bio });
      setIsEditing(false);
      toast.success('Bio updated!');
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio');
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !userId) return;
    try {
      const isFollowing = followers.includes(user.uid);
      const newFollowers = isFollowing
        ? followers.filter(id => id !== user.uid)
        : [...followers, user.uid];

      await updateDoc(doc(db, 'users', userId), { followers: newFollowers });
      setFollowers(newFollowers);
      toast.success(isFollowing ? 'Unfollowed' : 'Followed!');
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const isOwnProfile = user?.uid === userId;
  const isFollowing = followers.includes(user?.uid);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
    >
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Back
      </button>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8"
      >
        {/* Profile Header */}
        <div className="flex items-center gap-8 mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
            {profile?.displayName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile?.displayName}</h1>
            <p className="text-gray-600 mb-4">{profile?.email}</p>
            <div className="flex gap-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">{followers.length}</p>
                <p className="text-gray-600 text-sm">Followers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          {isEditing && isOwnProfile ? (
            <div className="flex gap-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleUpdateBio}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4">{bio || 'No bio added yet'}</p>
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Bio
                </button>
              )}
            </div>
          )}
        </div>

        {/* Follow Button */}
        {!isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isFollowing
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default Profile;