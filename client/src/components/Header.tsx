import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";


const Header = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    if (!authContext) {
        throw new Error('AuthContext must be use within an AuthProvider');
    }
    const { user, setUser, isLoading } = authContext;

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token');
        toast.success('Logged out Successfully');
        navigate('/');
    }
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                    <Link to="/" className="text-2xl font-bold text-gray-600 hover:text-gray-800 flex">
                    <img className="h-8 w-auto mr-3" src="/logo.png" alt="CoWork Logo" />
                    <span className="hidden sm:block">CoWork</span></Link>
                </div>

                <div className="flex space-x-4">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : user ? (
                        <>
                            <span className="text-gray-700 mt-2 hidden sm:block">Welcome!</span>
                            <Link to="/my-spaces" className="mt-2 text-gray-700 font-semibold hover:text-blue-600">
                                My Spaces
                            </Link>
                            <Link to="/create-space" className="mt-2 text-gray-700 font-semibold hover:text-blue-600">
                                Create Space
                            </Link>
                            <button onClick={handleLogout}
                                className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                            >
                                Login
                            </Link>
                            <Link to="/register" className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};
export default Header;