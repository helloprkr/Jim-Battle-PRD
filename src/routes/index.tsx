import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Dashboard } from '@/pages/Dashboard';
import { Health } from '@/pages/Health';
import { Projects } from '@/pages/Projects';
import { Nutrition } from '@/pages/Nutrition';
import { Login } from '@/pages/Login';

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/health" element={user ? <Health /> : <Navigate to="/login" />} />
      <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
      <Route path="/nutrition" element={user ? <Nutrition /> : <Navigate to="/login" />} />
    </Routes>
  );
};