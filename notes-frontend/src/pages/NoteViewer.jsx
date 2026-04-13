import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, Download, BookmarkPlus, Share2 } from 'lucide-react';
import NoteCard from '../components/NoteCard';

const NoteViewer = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(140);
  const [isSaved, setIsSaved] = useState(false);

  // Removed dummy data

  useEffect(() => {
    const fetchNoteDetais = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/${id}`);
        if (response.data) {
          setNote(response.data);
        }
      } catch (error) {
        setNote(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNoteDetais();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
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
        <div className="w-full aspect-[16/9] lg:aspect-[16/10] bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm relative">
          <object 
            data={note.file_url === 'dummy_url_for_now.pdf' || !note.file_url ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : note.file_url} 
            type="application/pdf" 
            className="w-full h-full"
          >
            <p>Your browser does not support PDFs. <a href={note.file_url}>Download the PDF</a>.</p>
          </object>
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
                <div className="text-xs text-text-secondary">4.2K subscribers</div>
              </div>
              <button className="ml-2 bg-text-primary text-bg-color px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
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
                onClick={() => setIsSaved(!isSaved)}
                className={`flex sm:hidden items-center p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors ${isSaved ? 'text-blue-500' : 'text-text-primary'}`}
              >
                <BookmarkPlus className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
              </button>
              
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors font-medium text-sm ${isSaved ? 'text-blue-500' : 'text-text-primary'} whitespace-nowrap`}
              >
                <BookmarkPlus className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="mt-4 bg-black/5 dark:bg-white/5 rounded-xl p-3 sm:p-4 text-sm text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer">
            <div className="font-medium mb-1">
              {note.views ? note.views.toLocaleString() : '8.2K'} views • {new Date(note.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <p className="whitespace-pre-line text-text-secondary w-full">
              {note.description || 'No description provided for these notes.'}
              {'\n\n'}Tags: {(note.tags || ['calculus', 'math']).join(', ')}
            </p>
          </div>

        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-text-primary">12 Comments</h2>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex-shrink-0"></div>
            <div className="flex-1 border-b border-border-color pb-1">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-transparent outline-none text-text-primary text-sm py-1"
              />
            </div>
          </div>
          {/* Dummy Comment */}
          <div className="flex gap-4 mt-6">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div>
              <div className="text-[13px] font-medium text-text-primary flex items-center gap-2">
                @AlexStudent <span className="text-text-secondary text-xs font-normal">2 days ago</span>
              </div>
              <p className="text-sm mt-1 text-text-primary">These notes helped me perfectly pass my exam last week! The breakdown of differential equations was exactly what I needed.</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs">
                  <ThumbsUp className="w-4 h-4" /> 12
                </button>
                <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary text-xs">
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="text-xs font-medium text-text-primary">Reply</button>
              </div>
            </div>
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
