import { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from '../components/NoteCard';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

// Removed dummy data

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        if (response.data) {
          setNotes(response.data);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
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
