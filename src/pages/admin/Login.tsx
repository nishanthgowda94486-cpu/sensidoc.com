// ...existing code...
import Login from '../auth/Login';

// Admin Login simply reuses the main Login component, but you can customize as needed
export default function AdminLogin() {
  return <Login role="admin" />;
}
