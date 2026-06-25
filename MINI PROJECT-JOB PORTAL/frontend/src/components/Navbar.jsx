import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-panel border-x-0 border-t-0 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-indigo-400" />
                            <span className="font-bold text-xl text-white tracking-tight">JobPortal</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/jobs" className="border-transparent text-gray-300 hover:border-indigo-400 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors">
                                Browse Jobs
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'recruiter' && (
                                    <Link to="/jobs/new" className="bg-indigo-600/90 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors backdrop-blur-sm border border-indigo-500/50">
                                        Post a Job
                                    </Link>
                                )}
                                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <div className="ml-3 relative flex items-center gap-4 border-l border-white/20 pl-4">
                                    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-indigo-300 transition-colors">
                                        <UserIcon className="h-5 w-5" />
                                        <span className="text-sm font-medium">{user.name}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center text-gray-400 hover:text-red-400 transition-colors">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup" className="bg-indigo-600/90 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors backdrop-blur-sm border border-indigo-500/50">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
