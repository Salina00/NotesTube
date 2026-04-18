import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import NoteViewer from './pages/NoteViewer';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SavedNotes from './pages/SavedNotes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/note/:id" element={<NoteViewer />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/saved" element={<SavedNotes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
