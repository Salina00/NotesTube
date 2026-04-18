import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import NoteCard from '../components/NoteCard';

const Profile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('notes');
  const { currentUser } = useAuth();
  
  const [userProfile, setUserProfile] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Determine the user ID to fetch
        const targetUserId = (id === 'me' && currentUser) ? currentUser._id : id;
        
        if (!targetUserId) {
          setLoading(false);
          return;
        }

        const [userRes, notesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/user/${targetUserId}`),
          axios.get(`http://localhost:5000/api/notes/user/${targetUserId}`)
        ]);

        if (userRes.data) {
          setUserProfile(userRes.data);
        }
        if (notesRes.data) {
          setUserNotes(notesRes.data);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser]);

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!userProfile) {
    return <div className="p-10 text-center">User not found</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      
      {/* Profile Header (Banner & Avatar) */}
      <div className="w-full h-40 sm:h-52 md:h-64 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-800 relative mb-16 sm:mb-20">
        <div className="absolute -bottom-12 sm:-bottom-16 left-6 sm:left-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-bg-color bg-blue-500 flex items-center justify-center text-white text-4xl sm:text-6xl font-bold">
            {(userProfile.name || userProfile.email || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-10 flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{userProfile.name || 'Anonymous User'}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-text-secondary text-sm">
            <span className="font-medium text-text-primary">@{userProfile.email?.split('@')[0] || 'user'}</span>
            <span>•</span>
            <span>{(userProfile.subscribersCount || userProfile.followers?.length || 0).toLocaleString()} subscribers</span>
            <span>•</span>
            <span>{userNotes.length} notes</span>
          </div>
          <p className="mt-4 text-text-primary max-w-2xl text-sm leading-relaxed">
            {userProfile.bio || 'No bio available.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-secondary">
            {userProfile.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {userProfile.location}</span>}
            {userProfile.website && <span className="flex items-center gap-1"><LinkIcon className="w-4 h-4" /> <a href={userProfile.website} className="text-blue-500 hover:underline">Website</a></span>}
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          {id === 'me' ? (
            <>
              <button className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full font-medium transition-colors text-sm">
                Customize profile
              </button>
              <button className="px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full font-medium transition-colors text-sm">
                Manage notes
              </button>
            </>
          ) : (
            <button className="px-5 py-2 bg-text-primary text-bg-color rounded-full font-medium hover:opacity-90 transition-opacity text-sm">
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border-color px-4 sm:px-10 flex gap-8">
        {['notes', 'playlists', 'liked', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-sm font-medium transition-colors relative uppercase tracking-wider ${
              activeTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-10 py-6">
        
        {activeTab === 'notes' && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Uploaded Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
              {userNotes.length > 0 ? userNotes.map(note => (
                <NoteCard key={note._id} note={note} />
              )) : (
                <div className="text-sm text-text-secondary">No notes uploaded yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'liked' && (
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Liked Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
              {userProfile.savedNotes && userProfile.savedNotes.length > 0 ? userProfile.savedNotes.map(note => (
                <NoteCard key={note._id || note} note={note.title ? note : { ...note, _id: note }} />
              )) : (
                <div className="text-sm text-text-secondary">No saved notes yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="text-center py-10 text-text-secondary">
            <p>This user hasn't created any playlists yet.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl flex flex-col sm:flex-row gap-10">
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-text-primary mb-2">Description</h2>
              <p className="text-sm text-text-primary whitespace-pre-line">{userProfile.bio || 'No description available for this user.'}</p>
              
              {userProfile.website && (
                <div className="mt-8 border-t border-border-color pt-6">
                  <h2 className="font-semibold text-lg text-text-primary mb-3">Links</h2>
                  <a href={userProfile.website} className="text-blue-500 hover:underline text-sm font-medium">{userProfile.website}</a>
                </div>
              )}
            </div>
            
            <div className="sm:w-64 border-t sm:border-t-0 sm:border-l border-border-color pt-6 sm:pt-0 sm:pl-6 space-y-4">
              <h2 className="font-semibold text-lg text-text-primary">Stats</h2>
              <div className="text-sm border-b border-border-color pb-2">Joined {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</div>
              {/* Could sum views from userNotes if needed */}
              <div className="text-sm border-b border-border-color pb-2">
                {userNotes.reduce((total, n) => total + (n.views || 0), 0).toLocaleString()} views
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
