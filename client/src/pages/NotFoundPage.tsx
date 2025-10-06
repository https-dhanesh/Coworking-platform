import { Link } from 'react-router-dom';
const NotFoundPage = () => {
  return (
    <div className="text-center p-20">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go back to Homepage</Link>
    </div>
  );
};
export default NotFoundPage;