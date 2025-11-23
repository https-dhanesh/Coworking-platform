import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { IoMenu, IoClose } from "react-icons/io5";


const Header = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const navLinks = (
        <>
            <Link to="/my-spaces" className="py-2 px-3 text-gray-700 font-semibold hover:text-blue-600">
                My Spaces
            </Link>
            {user?.role === 'owner' && (
                <Link to="/owner-dashboard" className="py-2 px-3 text-gray-700 font-semibold hover:text-blue-600">
                    Owner Dashboard
                </Link>
            )}
            <Link to="/my-bookings" className="py-2 px-3 text-gray-700 font-semibold hover:text-blue-600">
                My Bookings
            </Link>
            <Link to="/create-space" className="py-2 px-3 text-gray-700 font-semibold hover:text-blue-600">
                Create Space
            </Link>
            <button onClick={handleLogout}
                className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-in-out">
                Logout
            </button>
        </>
    );

    const guestLinks = (
        <>
            <Link to="/login" className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-100 transition-all duration-300"
            >
                Login
            </Link>
            <Link to="/register" className="px-4 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 ease-in-out">
                Register
            </Link>
        </>
    );


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-900 flex items-center">
                        <img className="h-8 w-auto mr-3" src="/logo.png" alt="CoWork Logo" />
                        <span className="hidden sm:block pr-8">CoWork</span>
                    </Link>
                </div>

                <div className="md:hidden">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-2xl text-gray-700 hover:text-blue-600 focus:outline-none"
                    >
                        {isMenuOpen ? <IoClose /> : <IoMenu />}
                    </button>
                </div>

                <div className="hidden md:flex space-x-4 items-center">
                    {isLoading ? <div>Loading...</div> : user ? navLinks : guestLinks}
                </div>
            </nav>
            {isMenuOpen && (
                <div 
                    className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40 p-4"
                >
                    <div className="flex flex-col space-y-2">
                        {isLoading ? <div>Loading...</div> : user ? (
                            <div className="flex flex-col space-y-2" onClick={() => setIsMenuOpen(false)}>
                                {navLinks}
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2" onClick={() => setIsMenuOpen(false)}>
                                {guestLinks}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
export default Header;