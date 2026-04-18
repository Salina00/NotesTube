import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import NoteCard from '../components/NoteCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/search?q=${encodeURIComponent(query)}`);
        setNotes(response.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Search Results for "{query}"
      </h1>

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
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
          {notes.map((note) => (
            <NoteCard key={note._id || note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-text-secondary">
          No notes found matching your search.
        </div>
      )}
    </div>
  );
};

export default Search;
