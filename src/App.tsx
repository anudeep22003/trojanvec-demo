import { Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import ContentModerationPage from './ContentModerationPage';


export default function App() {
  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/moderation" className="text-gray-700 hover:text-blue-600">
                Content Moderation
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<ContentModerationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}