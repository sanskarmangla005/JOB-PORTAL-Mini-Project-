import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'seeker'
    });
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Registration successful');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-[80vh] flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                    Create new account
                </h2>
                <p className="mt-2 text-center text-sm text-indigo-200">
                    Or{' '}
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-panel px-4 py-8 shadow-2xl sm:rounded-2xl sm:px-10 transform hover:scale-[1.01] transition-all duration-300">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-indigo-100">Full Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="block w-full appearance-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="block w-full appearance-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="block w-full appearance-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Role selection hidden so only Admin/Owner can post jobs. New users default to seeker. */}
                        <div className="hidden">
                            <input
                                type="hidden"
                                name="role"
                                value="seeker"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-lg border border-indigo-500/50 bg-indigo-600/90 py-2.5 px-4 text-sm font-medium text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-transparent px-2 text-indigo-300">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center w-full">
                            <GoogleLogin 
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        await googleLogin(credentialResponse.credential);
                                        toast.success('Registration successful via Google');
                                        navigate('/');
                                    } catch (err) {
                                        toast.error(err.response?.data?.message || 'Google Registration failed');
                                    }
                                }}
                                onError={() => {
                                    toast.error('Google Registration failed');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
