import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NoteCard from '../components/NoteCard';

const SavedNotes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const fetchSavedNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(res.data.savedNotes || []);
      } catch (error) {
        console.error("Error fetching saved notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedNotes();
  }, [currentUser]);

  if (!currentUser) return <div className="p-8 text-center text-text-primary">Please log in to view saved notes.</div>;
  if (loading) return <div className="p-8 text-text-primary">Loading...</div>;

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Saved Notes</h1>
      {notes.length === 0 ? (
        <p className="text-text-secondary">You haven't saved any notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-x-4 sm:gap-y-8">
          {notes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedNotes;
