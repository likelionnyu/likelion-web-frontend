import { Navigate } from 'react-router-dom';

function isSessionValid() {
  const token = localStorage.getItem('token');
  const expiry = Number(localStorage.getItem('tokenExpiry'));
  if (!token || !expiry || Date.now() > expiry) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    return false;
  }
  return true;
}

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isSessionValid() || !user.is_admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
