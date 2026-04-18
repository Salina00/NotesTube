import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload as UploadIcon, FileText, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const inputRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (f) => {
    if (f.type === 'application/pdf') {
      setFile(f);
      if(!title) setTitle(f.name.replace('.pdf', ''));
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    if (!currentUser) return alert("You must be logged in to upload notes!");
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subject', category);
      formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
      formData.append('uploaded_by', currentUser.name || currentUser.email);
      formData.append('uploaded_by_id', currentUser._id);
      formData.append('file', file); // Multer expects 'file'

      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUploadSuccess(true);
      // Reset form
      setTimeout(() => {
        setFile(null);
        setTitle('');
        setDescription('');
        setTags('');
        setCategory('');
        setUploadSuccess(false);
        navigate('/'); // Redirect to home
      }, 2000);
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error uploading note.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Upload Notes</h1>
      
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Notes uploaded successfully!</p>
        </div>
      )}
      
      <div className="bg-surface-color border border-border-color rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {!file ? (
          <div 
            className={`w-full aspect-[2/1] min-h-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-border-color bg-black/5 dark:bg-white/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <UploadIcon className="w-8 h-8" />
            </div>
            <p className="text-text-primary font-medium text-lg">Drag and drop PDF files</p>
            <p className="text-text-secondary text-sm mt-1 mb-4">or</p>
            <button 
              type="button"
              onClick={onButtonClick}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
            >
              Select Files
            </button>
            <input 
              ref={inputRef} 
              type="file" 
              accept=".pdf,application/pdf"
              className="hidden" 
              onChange={handleChange} 
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-between p-4 border border-border-color rounded-xl bg-black/5 dark:bg-white/5 mb-6">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 outline-none" />
              </div>
              <div className="truncate">
                <p className="text-text-primary font-medium truncate">{file.name}</p>
                <p className="text-text-secondary text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={clearFile}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-text-secondary flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`mt-6 space-y-5 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Title (required)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border border-border-color rounded-lg px-4 py-2.5 outline-none text-text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="e.g. Chapter 5 - Differential Equations"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border border-border-color rounded-lg px-4 py-2.5 outline-none text-text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-[100px]"
              placeholder="Tell viewers about your notes"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-color border border-border-color rounded-lg px-4 py-2.5 outline-none text-text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Engineering">Engineering</option>
                <option value="Programming">Programming</option>
                <option value="Science">Science</option>
                <option value="Math">Math</option>
                <option value="Exams">Exams</option>
                <option value="General Notes">General Notes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-transparent border border-border-color rounded-lg px-4 py-2.5 outline-none text-text-primary focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g. calculus, math, exam-prep"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border-color">
            <button 
              type="button" 
              onClick={clearFile}
              className="px-6 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-text-primary font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploading}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Uploading...' : 'Publish'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Upload;
