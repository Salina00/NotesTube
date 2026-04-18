import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NoteCard from '../components/NoteCard';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCreators, setTopCreators] = useState([]);
  const [trendingNotes, setTrendingNotes] = useState([]);

// Removed dummy data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, creatorsRes, trendingRes] = await Promise.all([
          axios.get('http://localhost:5000/api/notes'),
          axios.get('http://localhost:5000/api/users/top-subscribed').catch(() => ({ data: [] })),
          axios.get('http://localhost:5000/api/notes/top-liked').catch(() => ({ data: [] }))
        ]);
        
        if (notesRes.data) setNotes(notesRes.data);
        if (creatorsRes.data) setTopCreators(creatorsRes.data);
        if (trendingRes.data) setTrendingNotes(trendingRes.data);
        
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["All", "Programming", "Engineering", "Science", "Math", "Exams", "Design"];
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="pb-8">
      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category 
                ? 'bg-text-primary text-bg-color' 
                : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Top Creators / Subscribed */}
      {topCreators.length > 0 && !loading && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">Top Creators</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {topCreators.map(creator => (
              <Link to={`/profile/${creator._id || 'user'}`} key={creator._id} className="flex flex-col items-center gap-2 min-w-[80px] group">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold group-hover:ring-4 ring-blue-500/30 transition-all">
                  {(creator.name || creator.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-medium text-text-primary max-w-full truncate px-1">
                  {creator.name || creator.email?.split('@')[0] || "User"}
                </div>
                <div className="text-xs text-text-secondary">
                  {creator.subscribersCount || 0} subs
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trending / Most Liked Notes */}
      {trendingNotes.length > 0 && !loading && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">Trending Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
            {trendingNotes.map(note => (
              <NoteCard key={note._id || note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-text-primary mb-4">All Notes</h2>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2 w-full animate-pulse">
              <div className="w-full aspect-[4/3] bg-black/10 dark:bg-white/10 rounded-xl"></div>
              <div className="flex gap-3 pr-6 mt-1">
                <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 flex-shrink-0"></div>
                <div className="flex flex-col gap-2 w-full pt-1">
                  <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-[90%]"></div>
                  <div className="h-3 bg-black/10 dark:bg-white/10 rounded w-[60%]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
          {notes
            .filter(n => activeCategory === "All" || n.subject === activeCategory)
            .map((note) => (
              <NoteCard key={note._id || note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
