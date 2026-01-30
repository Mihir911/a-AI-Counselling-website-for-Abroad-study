import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Counsellor from './pages/Counsellor';
import Universities from './pages/Universities';
import Application from './pages/Application';
import Profile from './pages/Profile';
import './index.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading AI Counsellor...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      <Route path="/onboarding" element={
        <ProtectedRoute>
          {user?.onboardingComplete ? <Navigate to="/dashboard" /> : <Onboarding />}
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute requireOnboarding>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/counsellor" element={
        <ProtectedRoute requireOnboarding>
          <Counsellor />
        </ProtectedRoute>
      } />

      <Route path="/universities" element={
        <ProtectedRoute requireOnboarding>
          <Universities />
        </ProtectedRoute>
      } />

      <Route path="/application" element={
        <ProtectedRoute requireOnboarding>
          <Application />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
