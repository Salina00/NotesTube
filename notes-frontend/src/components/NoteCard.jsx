import { Link } from 'react-router-dom';
import { MoreVertical, CheckCircle2 } from 'lucide-react';

const NoteCard = ({ note }) => {
  return (
    <div className="flex flex-col gap-2 group cursor-pointer w-full">
      <Link to={`/note/${note._id || note.id}`} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
        <img 
          src={note.thumbnailUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={note.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          PDF
        </div>
      </Link>
      
      <div className="flex gap-3 pr-6 relative">
        <Link to={`/profile/${note.uploaded_by_id || 'user'}`} className="mt-1 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {(note.uploaded_by || "U").charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className="flex flex-col">
          <Link to={`/note/${note._id || note.id}`} className="text-base font-semibold text-text-primary line-clamp-2 leading-tight">
            {note.title}
          </Link>
          <Link to={`/profile/${note.uploaded_by_id || 'user'}`} className="text-sm text-text-secondary mt-1 flex items-center gap-1 hover:text-text-primary transition-colors">
            {note.uploaded_by || "Unknown User"}
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
          </Link>
          <div className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
            <span>{note.views ? (note.views.toLocaleString() + ' views') : '1.2K views'}</span>
            <span className="text-[10px]">•</span>
            <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '2 days ago'}</span>
          </div>
          {note.subject && (
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-text-secondary font-medium">
                {note.subject}
              </span>
            </div>
          )}
        </div>
        <button className="absolute right-0 top-1 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
