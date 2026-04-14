import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import SupportWidget from './components/SupportWidget';
import CosmicBackground from './components/CosmicBackground';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetails from './pages/ClientDetails';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import './index.css';

const queryClient = new QueryClient();

function AppContent() {
  const { theme } = useTheme();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative">
        {theme === 'cosmic' && <CosmicBackground />}
        <div className="relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ClientList />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ClientDetails />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Admin />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Settings />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Calendar />
                  <SupportWidget />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
