import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, Download, BookmarkPlus, Share2 } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/AuthContext';

const NoteViewer = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [uploader, setUploader] = useState(null);
  const { currentUser, updateCurrentUser } = useAuth();

  useEffect(() => {
    const fetchNoteDetais = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/${id}`);
        if (response.data) {
          setNote(response.data);
          const currentLikes = response.data.likes || [];
          setLikes(currentLikes.length);
          const uid = currentUser ? currentUser._id : "anonymous";
          setIsLiked(currentLikes.includes(uid));

          if (currentUser && currentUser.savedNotes && currentUser.savedNotes.includes(response.data._id)) {
            setIsSaved(true);
          }
          if (currentUser && currentUser.following && currentUser.following.includes(response.data.uploaded_by_id)) {
            setIsSubscribed(true);
          }
          
          if (response.data.uploaded_by_id) {
            try {
              const userRes = await axios.get(`http://localhost:5000/api/users/user/${response.data.uploaded_by_id}`);
              setUploader(userRes.data);
            } catch (err) {
              console.error("Error fetching uploader:", err);
            }
          }
        }
        const commentsRes = await axios.get(`http://localhost:5000/api/notes/${id}/comments`);
        if (commentsRes.data) setComments(commentsRes.data);
      } catch (error) {
        setNote(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNoteDetais();
  }, [id, currentUser]);

  const handleLike = async () => {
    try {
      const uid = currentUser ? currentUser._id : "anonymous";
      const response = await axios.put(`http://localhost:5000/api/notes/like/${id}`, { userId: uid });
      const currentLikes = response.data.likes || [];
      setLikes(currentLikes.length);
      setIsLiked(currentLikes.includes(uid));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return alert("Must be logged in to save notes!");
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/save-note/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(response.data.includes(id));
      updateCurrentUser({ ...currentUser, savedNotes: response.data });
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) return alert("Must be logged in to subscribe!");
    if (currentUser._id === note.uploaded_by_id) return alert("Cannot subscribe to yourself!");
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/subscribe/${note.uploaded_by_id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSubscribed(response.data.following.includes(note.uploaded_by_id));
      updateCurrentUser({ ...currentUser, following: response.data.following });
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    if (e.key === 'Enter' && newCommentText.trim()) {
      if (!currentUser) return alert("Must be logged in to comment!");
      try {
        const payload = {
          userId: currentUser._id,
          userName: currentUser.name || currentUser.email,
          userAvatar: "",
          text: newCommentText
        };
        const response = await axios.post(`http://localhost:5000/api/notes/${id}/comment`, payload);
        setComments([response.data, ...comments]);
        setNewCommentText("");
      } catch (error) {
        console.error("Error posting comment", error);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading note...</div>;
  }

  if (!note) {
    return <div className="p-4">Note not found.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-8">
      
      {/* Main Content Area */}
      <div className="flex-1 lg:max-w-4xl xl:max-w-5xl">
        {/* PDF Viewer Placeholder - 16:9 or similar ratio */}
        <div className="w-full aspect-[16/9] lg:aspect-[16/10] bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm relative flex items-center justify-center">
          {(!note.file_url || note.file_url === 'dummy_url_for_now.pdf') ? (
            <p className="text-text-secondary">No PDF file available for this note.</p>
          ) : (
            <object 
              data={note.file_url} 
              type="application/pdf" 
              className="w-full h-full"
            >
              <p>Your browser does not support PDFs. <a href={note.file_url}>Download the PDF</a>.</p>
            </object>
          )}
        </div>

        {/* Video Info Section */}
        <div className="mt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary line-clamp-2">
            {note.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            {/* Uploader Info */}
            <div className="flex items-center gap-3">
              <Link to={`/profile/${note.uploaded_by_id}`} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {(note.uploaded_by || "U").charAt(0).toUpperCase()}
              </Link>
              <div>
                <Link to={`/profile/${note.uploaded_by_id}`} className="font-semibold text-text-primary text-[15px] block truncate max-w-[150px]">
                  {note.uploaded_by}
                </Link>
                <div className="text-xs text-text-secondary">
                  {uploader ? (uploader.subscribersCount || 0) : 0} subscribers
                </div>
              </div>
              <button 
                onClick={handleSubscribe} 
                className={`ml-2 px-4 py-2 rounded-full text-sm font-medium transition-opacity ${isSubscribed ? 'bg-black/10 dark:bg-white/10 text-text-primary' : 'bg-text-primary text-bg-color hover:opacity-90'}`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="flex bg-black/5 dark:bg-white/10 rounded-full">
                <button 
                  onClick={handleLike} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-l-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border-r border-border-color ${isLiked ? 'text-blue-500' : 'text-text-primary'}`}
                >
                  <ThumbsUp className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                  <span className="text-sm font-medium">{likes}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-r-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-primary">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors font-medium text-sm text-text-primary whitespace-nowrap">
                <Share2 className="w-5 h-5" /> Share
              </button>

              <a href={note.file_url} download className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors font-medium text-sm text-text-primary whitespace-nowrap">
                <Download className="w-5 h-5" /> Download
              </a>

              <button 
                onClick={handleSave}
                className={`flex sm:hidden items-center p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors ${isSaved ? 'text-blue-500' : 'text-text-primary'}`}
              >
                <BookmarkPlus className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
              </button>
              
              <button 
                onClick={handleSave}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors font-medium text-sm ${isSaved ? 'text-blue-500' : 'text-text-primary'} whitespace-nowrap`}
              >
                <BookmarkPlus className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 bg-black/5 dark:bg-white/5 rounded-xl p-3 sm:p-4 text-sm text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="font-medium mb-1">
              {note.views ? note.views.toLocaleString() : '0'} views • {new Date(note.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <p className="whitespace-pre-line text-text-secondary w-full">
              {note.description || 'No description provided for these notes.'}
              {note.tags && note.tags.length > 0 && (
                <>{'\n\n'}Tags: {note.tags.join(', ')}</>
              )}
            </p>
          </div>

        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-text-primary">{comments.length} Comments</h2>
          <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${currentUser ? 'bg-blue-600' : 'bg-gray-400'}`}>
              {currentUser ? (currentUser.name || currentUser.email).charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="flex-1 border-b border-border-color pb-1">
              <input 
                type="text" 
                placeholder="Add a comment... (Press Enter to post)" 
                className="w-full bg-transparent outline-none text-text-primary text-sm py-1"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={handleCommentSubmit}
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">
                  {(comment.userName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-text-primary flex items-center gap-2">
                    @{comment.userName || 'user'} <span className="text-text-secondary text-xs font-normal">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mt-1 text-text-primary">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs">
                      <ThumbsUp className="w-4 h-4" /> {comment.likes?.length || 0}
                    </button>
                    <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button className="text-xs font-medium text-text-primary">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar for Related Notes */}
      <div className="lg:w-[350px] xl:w-[400px] flex flex-col gap-3 lg:pt-0 pt-4 border-t lg:border-t-0 border-border-color">
        <h3 className="font-semibold text-text-primary mb-2">Related Notes</h3>
        <div className="text-sm text-text-secondary">No related notes found.</div>
      </div>

    </div>
  );
};

export default NoteViewer;
